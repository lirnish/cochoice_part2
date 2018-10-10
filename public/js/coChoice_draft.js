 //Removes the current content from the page and replaces with different content
function showSlide(id) {

  $(".slide").hide();

  $("#"+id).show();

};

//An Object governing everything to do with the task -- presenting stimuli, handling responses, saving data
var trialSequence = {

//creates proxy functions for keyPress handlers + functions used within keyPress handlers so that the variables don't get messed up
intialize: function(){
  this.proxy_keypress1 = $.proxy(this.keyPress_1, this)
  this.proxy_keypress2 = $.proxy(this.keyPress_2, this)
  this.proxy_nexttrial = $.proxy(this.startSequence, this)
},

//the shapes used in the task
shapes: ["circle", "circle", "square", "square"],

// *** variables for saving data about the trial set-up + the participant's response *** 

//these variables save the name of the shape that is at each position in each trial 
//(need to update with grid_position_order)
top_left: "",
top_right: "",
bottom_right: "",
bottom_left: "",
grid_position_order: 0,

//variables for saving response data 
//(need to update with timing variables)
response_key_1: "",
shape_choice_1: "",
shape_position_1: "",

response_key_2: "",
shape_choice_2: "",
shape_position_2: "",

//timing variables
task_start_time: 0,
task_end_time: 0,

trial_start_time: 0,
trial_end_time: 0,

fixation_onset: 0,
fixation_offset: 0,
stimulus_onset: 0,
stimulus_offset: 0,

response_1_time: 0,
response_2_time: 0,

response_1_latency: 0,
response_2_latency: 0,
inter_response_latency: 0,

//tracks the trial number so that the experiment can terminate when enough trials have passed
trial_num: 0,

//array containing all of the data saved over time
data: [],

//initializes a new trial
startSequence: function(){
  
  //checks if it's the first trial of the sequence and if not, cleans up after the last trial
  if(this.trial_num != 0){
    //get rid of the timeout message
    
    //remove borders from the shapes
    $('.topL').css('border', '0')
    $('.topR').css('border', '0')
    $('.bottomL').css('border', '0')
    $('.bottomR').css('border', '0')

    //reset response data
    this.response_key_1 = ''
    this.response_key_2 = ''
  }
  else{
    //this is the first trial of the task, so record current time as task_start_time
    this.task_start_time = new Date().getTime()
  }
  
  //increments trial_num by 1
  this.trial_num ++;

  //displays the fixation slide
  showSlide("fixation")

  //record current time as trial start time and as fixation onset
  this.trial_start_time = new Date().getTime()
  this.fixation_onset = new Date().getTime()
  //sets up the stimulus grid to display after 1500ms
  //always redefine "this" as _this before trying to use it in a setTimeout function or it won't work
  _this = this
  setTimeout(function(){ _this.fixation_offset = new Date().getTime(); _this.displayGrid() }, 1500)
},

//checks configuration of shapes in the grid and assigns an integer representing one of 6 possible options
getGridOrder: function(top_left, top_right, bottom_left, bottom_right){
  if(top_left == "circle" && top_right == "circle"){
    this.grid_position_order = 1
  }
  else if(top_left == "circle" && bottom_left == "circle"){
    this.grid_position_order = 2
  }
  else if(top_left == "circle" && bottom_right == "circle"){
    this.grid_position_order = 3
  }
  else if(top_left == "square" && top_right == "square"){
    this.grid_position_order = 4
  }
  else if(top_left == "square" && bottom_left == "square"){
    this.grid_position_order = 5
  }
  else if(top_left == "square" && bottom_right == "square"){
    this.grid_position_order = 6
  }
},

//displays the stimulus grid
displayGrid: function(){
  $('#timeout').html('')

  //shuffle the array of circles and squares so that they are selected in a randomized order
  shuff_grid = _.shuffle(this.shapes)

  //randomly select shapes and assign them to the position variables
  // each variable will just be the string "square" or "circle"
  this.top_left = shuff_grid.pop()
  this.top_right = shuff_grid.pop()
  this.bottom_right = shuff_grid.pop()
  this.bottom_left = shuff_grid[0]

  this.getGridOrder(this.top_left, this.top_right, this.bottom_left, this.bottom_right)
  console.log(this.grid_position_order)

  //display the stimulus grid page so that the shapes can be added to the grid
  showSlide("stim_stage")
  //change the ids of each position on the grid to 'square' or 'circle', which assigns them CSS parameters that give them those shapes
  $('.topL').html('<div id='+this.top_left+'></div>')
  $('.topR').html('<div id='+this.top_right+'></div>')
  $('.bottomR').html('<div id='+this.bottom_right+'></div>')
  $('.bottomL').html('<div id='+this.bottom_left+'></div>')

  this.stimulus_onset = new Date().getTime();
  //activate the first key press handler
  $(document).on('keydown', this.proxy_keypress1)

  //set up the trial to end after 3000ms
  var _this = this
  setTimeout(function(){_this.stimulus_offset = new Date().getTime(); _this.endTrial() }, 3000)
},

//intializes next trial
endTrial: function(){
  this.trial_end_time = new Date().getTime()
  //checks if either response key was left empty
  if(this.response_key_1 == '' || this.response_key_2 == ''){
    $('#timeout').html('PLEASE RESPOND FASTER')
    //set response variables to 'NaN'if supposed to be numbers or "N/A" if supposed to be str
    if(this.response_key_1 == '' && this.response_key_2 == ''){
      this.response_key_1 = 'N/A'
      this.shape_choice_1 = 'N/A'
      this.shape_position_1 = 'N/A'

      this.response_key_2 = 'N/A'
      this.shape_choice_2 = 'N/A'
      this.shape_position_2 = 'N/A'

      this.response_1_time = "NaN"
      this.response_2_time = "NaN"
      this.response_1_latency = "NaN"
      this.response_2_latency = "NaN"
      this.inter_response_latency = "NaN"
    }
    else{
      this.response_key_2 = "N/A"
      this.shape_choice_2 = "N/A"
      this.shape_position_2 = "N/A"

      this.response_2_latency = "NaN"
      this.inter_response_latency = "NaN"
    }
  }
  else{
    this.response_1_latency = this.response_1_time - this.stimulus_onset
    this.response_2_latency = this.response_2_time - this.stimulus_onset

    this.inter_response_latency = this.response_2_latency - this.response_1_latency
  }
  //save trial data as an object and add that to the data array
  var data = {
    trial: trialSequence.trial_num,

    top_left: trialSequence.top_left,
    top_right: trialSequence.top_right,
    bottom_right: trialSequence.bottom_right,
    bottom_left: trialSequence.bottom_left,

    grid_position_order: trialSequence.grid_position_order,

    response_key_1: trialSequence.response_key_1,
    shape_choice_1: trialSequence.shape_choice_1,
    shape_position_1: trialSequence.shape_position_1,

    response_key_2: trialSequence.response_key_2,
    shape_choice_2: trialSequence.shape_choice_2,
    shape_position_2: trialSequence.shape_position_2,

    trial_start_time: trialSequence.trial_start_time,
    trial_end_time: trialSequence.trial_end_time,

    fixation_onset: trialSequence.fixation_onset,
    fixation_offset: trialSequence.fixation_offset,
    stimulus_onset: trialSequence.stimulus_onset,
    stimulus_offset: trialSequence.stimulus_offset,

    response_1_time: trialSequence.response_1_time,
    response_2_time: trialSequence.response_2_time,

    response_1_latency: trialSequence.response_1_latency,
    response_2_latency: trialSequence.response_2_latency,
    inter_response_latency: trialSequence.inter_response_latency
    }
    this.data.push(data)
    console.log(data)

  if(this.trial_num < 5){
    this.startSequence()
  }
  else{
    this.task_end_time = new Date().getTime()
    //this.data.push(task_end_time)
    $.ajax({
      type: "POST",
      url: "/experiment-data",
      data: JSON.stringify(trialSequence.data),
      contentType: "application/json"
    })
    .done(function(){
      window.location.href = "debrief";
    })
    .fail(function(){
      window.location.href = "/";
    })
  }
  
},

//saves response data
//'num' indicates whether data is from the first response or the second
updateData: function(num, response_key, shape_choice, shape_position){
  if(num == 1){
    this.response_key_1 = response_key
    this.shape_choice_1 = shape_choice
    this.shape_position_1 = shape_position
    
  }
  else if(num = 2){
    this.response_key_2 = response_key
    this.shape_choice_2 = shape_choice
    this.shape_position_2 = shape_position
  }

},

//keypress handler for response 1
keyPress_1: function(event){
  //saves the keycode for the key that was pressed
  var keyCode = event.which;
  
  //checks if key pressed was a valid response and has different consequences based on whether or not it was
  if(keyCode != 81 &&  keyCode != 65 && keyCode != 80 && keyCode !=76){
    //if response was not valid, keyPress_1 is reactivated
    $(document).on('keydown', this.proxy_keypress1)
  }
  else{
    this.response_1_time = new Date().getTime()
    //if response was valid, data is updated based on that response
    if(keyCode == 81){
    //p selected Q (top left)
      shape = this.top_left
      //updates response data
      this.updateData(1, 'Q', shape, 'top left') 
      //creates border around selected shape
      $('.topL').css('border', 'medium solid black')
      //removes key press handler 1 from document
      $(document).off('keydown', this.proxy_keypress1)
      //attaches keypress handler 2 to document
      $(document).on('keydown', this.proxy_keypress2)
   }
   //the same steps are repeated for the three other keys
    else if(keyCode == 65){
    //p selected A (bottom left)
      shape = this.bottom_left
      this.updateData(1, 'A', shape, 'bottom left')
      $('.bottomL').css('border', 'medium solid black')
      $(document).off('keydown', this.proxy_keypress1)
      $(document).on('keydown', this.proxy_keypress2)
  }
    else if(keyCode == 80){
    //p selected P (top right)
      shape = this.top_left
      this.updateData(1, 'P', shape, 'top right')
      $('.topR').css('border', 'medium solid black')
      $(document).off('keydown', this.proxy_keypress1)
      $(document).on('keydown', this.proxy_keypress2)
  }
    else if(keyCode == 76){
    //p selected L (bottom right)
      shape = this.top_left
      this.updateData(1, 'L', shape, 'bottom right')
      $('.bottomR').css('border', 'medium solid black')
      $(document).off('keydown', this.proxy_keypress1)
      $(document).on('keydown', this.proxy_keypress2)
    }
  }
},

// key press handler for the second response
//everything is basically the same as for keyPress_2 except code checks if key selected is the same as for response 1
//if key pressed matches response_key_1 it is treated the same way as an invalid key would be
keyPress_2: function(event){
  var keyCode = event.which;
  if(keyCode != 81 && keyCode != 65 && keyCode != 80 && keyCode !=76){
    $(document).one('keydown', this.proxy_keypress2)
  }
  else{
    if(keyCode == 81){
    //p selected Q (top left)
      if(this.response_key_1 == "Q"){
        $(document).on('keydown', this.proxy_keypress2)
      }
      else{
        this.response_2_time = new Date().getTime()
        shape = this.top_left
        this.updateData(2, 'Q', shape, 'top left')
        $('.topL').css('border', 'medium solid black')
        $(document).off('keydown', this.proxy_keypress2)
      }
    }
    else if(keyCode == 65){
    //p selected A (bottom left)
      if(this.response_key_1 == "A"){
        $(document).on('keydown', this.proxy_keypress2)
      }
      else{
        this.response_2_time = new Date().getTime()
        shape = this.bottom_left
        this.updateData(2, 'A', shape, 'bottom left')
        $('.bottomL').css('border', 'medium solid black')
        $(document).off('keydown', this.proxy_keypress2)
      }
    }
    else if(keyCode == 80){
    //p selected P (top right)
      if(this.response_key_1 == 'P'){
        $(document).on('keydown', this.proxy_keypress2)
      }
      else{
        this.response_2_time = new Date().getTime()
        shape = this.top_left
        this.updateData(2, 'P', shape, 'top right')
        $('.topR').css('border', 'medium solid black')
        $(document).off('keydown', this.proxy_keypress2)
      }
    }
    else if(keyCode == 76){
    //p selected L (bottom right)
      if(this.response_key_1 == 'L'){
        $(document).on('keydown', this.proxy_keypress2)
      }
      else{
        this.response_2_time = new Date().getTime()
        shape = this.top_left
        this.updateData(2, 'L', shape, 'bottom right')
        $('.bottomR').css('border', 'medium solid black')
        $(document).off('keydown', this.proxy_keypress2)
      }
    }

  }
}

}

showSlide("start")