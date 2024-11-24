document.addEventListener("DOMContentLoaded", () => {
  const classCardsContainer = document.getElementById("cards");
  const enrollBtn = document.getElementById("enrollBtn");
  const enrollModal = document.getElementById("enrollModal");
  const closeModal = document.getElementById("closeModal");
  const classCardsModalContainer = document.getElementById("classCards");
  const attendanceProgressBar = document.getElementById(
    "attendance-progress-bar"
  );
  function updateProgressBar(attendedClasses, totalClasses) {
    if (totalClasses > 0) {
      const attendancePercentage = (attendedClasses / totalClasses) * 100;
      attendanceProgressBar.style.width = `${attendancePercentage}%`;
      if (attendancePercentage < 75) {
        attendanceProgressBar.style.backgroundColor = "red";
      } else if (attendancePercentage < 85) {
        attendanceProgressBar.style.backgroundColor = "yellow";
      } else {
        attendanceProgressBar.style.backgroundColor = "var(--green)";
      }
    } else {
      attendanceProgressBar.style.width = "0%";
      attendanceProgressBar.style.backgroundColor = "red";
    }
  }
  if (!classCardsContainer) {
    console.error("Error: Could not find the class cards container.");
    return;
  }
  fetch("../backend/fetch_classes_of_a_student.php")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch classes");
      }
      return response.json();
    })
    .then((classes) => {
      let totalClasses = 0;
      let attendedClasses = 0;
      classCardsContainer.innerHTML = "";
      if (classes.error) {
        classCardsContainer.innerHTML = `<p>${classes.error}</p>`;
      } else {
        classes.forEach((classData) => {
          const classCard = document.createElement("div");
          classCard.classList.add("card");

          classCard.innerHTML = `
              <div class="card-header">
                <h3 class="class-id">Class ID: ${classData.class_id}</h3>
                <p class="class-title"><strong>Class Name:</strong> ${
                  classData.classname
                }</p>
              </div>
              <p class="start-time"><strong>Start Time:</strong> ${
                classData.starttime
              }</p>
              <p class="end-time"><strong>End Time:</strong> ${
                classData.endtime
              }</p>
              <p class="attendance-status">
                <strong>Attendance:</strong> ${
                  classData.isPresent === 1 ? "Yes" : "No"
                }
              </p>
              <p class="attendance-date">
                <strong>Attendance Date:</strong> ${classData.date}
              </p>
            `;
          totalClasses++;
          if (classData.isPresent === 1) {
            attendedClasses++;
          }
          if (totalClasses > 0) {
            updateProgressBar(attendedClasses, totalClasses);
          }
          classCardsContainer.appendChild(classCard);
        });
      }
    })
    .catch((error) => {
      console.error("Error fetching classes:", error);
      classCardsContainer.innerHTML =
        "<p>Failed to load classes. Please try again later.</p>";
    });
  enrollBtn.addEventListener("click", () => {
    fetch("../backend/fetch_available_classes.php")
      .then((response) => response.json())
      .then((classes) => {
        if (Array.isArray(classes)) {
          classCardsModalContainer.innerHTML = "";
          classes.forEach((classData) => {
            const classCard = document.createElement("div");
            classCard.classList.add("card");
            classCard.innerHTML = `
            <div class="card-header">
                <h3 class="class-id">Class ID: ${classData.id}</h3>
                <p class="class-title"><strong>Class Name:</strong> ${classData.classname}</p>
            </div>
            <p class="start-time"><strong>Start Time:</strong> ${classData.starttime}</p>
            <p class="end-time"><strong>End Time:</strong> ${classData.endtime}</p>
            <button class="enroll-btn" data-class-id="${classData.id}">Enroll</button>
            `;
            const enrollButton = classCard.querySelector(".enroll-btn");
            enrollButton.addEventListener("click", () => {
              const classId = enrollButton.getAttribute("data-class-id");
              fetch("../backend/enroll_in_class.php", {
                method: "POST",
                body: JSON.stringify({ class_id: classId }),
                headers: {
                  "Content-Type": "application/json",
                },
              })
                .then((response) => response.json())
                .then((data) => {
                  if (data.message) {
                    alert(data.message);
                    enrollModal.style.display = "none";
                  } else if (data.error) {
                    alert(data.error);
                  } else {
                    alert("Unexpected response from the server.");
                  }
                })
                .catch((error) => {
                  alert("Enrollment failed: " + error.message);
                });
            });
            classCardsModalContainer.appendChild(classCard);
          });
        } else {
          console.error(
            "Error: Expected an array of classes, but got:",
            classes
          );
          classCardsModalContainer.innerHTML =
            "<p>Failed to load classes. Please try again later.</p>";
        }
        enrollModal.style.display = "block";
      })
      .catch((error) => {
        console.error("Error fetching classes:", error);
        classCardsModalContainer.innerHTML =
          "<p>Failed to load classes. Please try again later.</p>";
      });
  });
  closeModal.addEventListener("click", () => {
    enrollModal.style.display = "none";
  });
  window.addEventListener("click", (event) => {
    if (event.target === enrollModal) {
      enrollModal.style.display = "none";
    }
  });
});
