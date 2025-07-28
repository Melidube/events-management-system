//grab the eventContainer
const  eventContainer = document.getElementById("event-container");
const  eventForm = document.getElementById("event-form");


//We need to call the api to get the list of events/data
//The data will be in an array data structure
function fetchEvents(){
      fetch('http://localhost:3000/events')
      .then((response) => response.json())
      .then((data) => {
            displayEvents(data)
      })
}

//We will loop through the array to have them displayed to the user
function displayEvents(events){
      for(let event of events){
             //create a container div
             const eventElement = document.createElement("div");
             eventElement.classList.add("event");
             
             //create the h2 element for the event title
             const titleElement = document.createElement("h2");
             titleElement.textContent = event.title;
              eventElement.appendChild(titleElement);

              //create the  p element to display event date
              const dateElement = document.createElement("p");
              dateElement.textContent = `Date: ${event.date}`;
              eventElement.appendChild(dateElement);

              //create the p element for dispalying the event location
              const  locationElement = document.createElement("p");
              locationElement.textContent = `Location: ${event.location}`;
               eventElement.appendChild(locationElement);

               //create a delete button
               const deleteButton = document.createElement("button");
               deleteButton.classList.add("right-btn");
               deleteButton.textContent = "Delete";
               deleteButton.addEventListener('click', () => deleteEvent(event.id));
               eventElement.appendChild(deleteButton);

               //create an edit button
                const editButton = document.createElement("button");
                editButton.classList.add("left-btn");
                editButton.textContent = "edit";
                editButton.addEventListener('click', () => showEditForm(event));
                eventElement.appendChild(editButton);
                 
                //append buttonDiv to eventElement
                eventContainer.appendChild(eventElement);
      }
}

function submitForm(event){
      event.preventDefault();
      
      const title = document.getElementById("title").value;
      const date = document.getElementById("date").value;
      const location = document.getElementById("location").value;

      fetch("http://localhost:3000/events",{
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify({title, date, location})
      }      
      )
      .then((response) => response.json())
      .then((newEvent) => {
            console.log('event created', newEvent)
            fetchEvents()
      })
}

//deleting an event
function deleteEvent(id) {
     fetch(`http://localhost:3000/events/${id}`,{
        method: 'DELETE'
     })
     .then((response) => {
          console.log("deleted")
         fetchEvents();
     })
}

//update event
function updateEvent(id){
   const title = document.getElementById("title").value;
   const date = document.getElementById("date").value;
   const location = document.getElementById("location").value;

   fetch(`http://localhost:3000/events/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({title, date, location })
   })
   .then((response) => response.json())
   .then((updatedEvent) => {
        fetchEvents();
   })
}

//show edite Form function
function showEditForm(event){
  document.getElementById('title').value = event.title;
  document.getElementById('date').value = event.date;
  document.getElementById('location').value = event.location;
  document.getElementById("submit-button").textContent = "Edit Event";

  eventForm.removeEventListener("submit", submitForm);
  eventForm.addEventListener("submit", function(submitEvent) {
         submitEvent.preventDefault();
         updateEvent(event.id);
  })
}

//form submission
eventForm.addEventListener('submit', submitForm);
fetchEvents();