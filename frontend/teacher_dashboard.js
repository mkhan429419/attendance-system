document.addEventListener("DOMContentLoaded", () => {
  const classCardsContainer = document.getElementById("classCards");
  const createClassBtn = document.querySelector(".create_class");
  const modal = document.querySelector(".modal");
  const closeBtn = document.querySelector(".close-btn");
  const createClassForm = document.getElementById("createClassForm");
  let classId;
  fetchClasses();

  createClassBtn.addEventListener("click", () => {
    modal.style.display = "flex";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";
  });

  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  createClassForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(createClassForm);
    fetch("../backend/create_class.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.text())
      .then((data) => {
        alert(data);
        modal.style.display = "none";
        fetchClasses();
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
      });
  });

  function fetchClasses() {
    fetch("../backend/teacher_dashboard.php")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch classes");
        }
        return response.json();
      })
      .then((classes) => {
        classCardsContainer.innerHTML = "";
        classes.forEach((classData) => {
          const classCard = document.createElement("div");
          classCard.classList.add("class-card");
          classCard.innerHTML = `
            <h3>Class ID: ${classData.id}</h3>
            <p><strong>Class Name:</strong> ${classData.classname}</p>
            <p><strong>Start Time:</strong> ${classData.starttime}</p>
            <p><strong>End Time:</strong> ${classData.endtime}</p>
            <button class="btn mark-attendance" data-classid="${classData.id}">Mark Attendance</button>
          `;
          classCardsContainer.appendChild(classCard);
        });
        document.querySelectorAll(".mark-attendance").forEach((button) => {
          button.addEventListener("click", (e) => {
            classId = e.target.dataset.classid;
            fetchAttendance(classId);
          });
        });
      })
      .catch((error) => {
        console.error("Error fetching classes:", error);
        classCardsContainer.innerHTML =
          "<p>Failed to load classes. Please try again later.</p>";
      });
  }

  function fetchAttendance(classId) {
    fetch(`../backend/fetch_attendance.php?classid=${classId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch attendance or student records");
        }
        return response.json();
      })
      .then((response) => {
        if (response.status === "attendance") {
          displayAttendance(response.data);
        } else if (response.status === "students") {
          displayStudentList(response.data, classId);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        alert("Failed to fetch data. Please try again later.");
      });
  }

  // Function to handle when a student marks attendance
  function displayAttendance(records) {
    console.log("records", records);
    const attendanceModal = document.createElement("div");
    attendanceModal.classList.add("attendance-modal");
    attendanceModal.innerHTML = `
    <div class="attendance-modal-content">
      <button class="close-attendance-modal">X</button>
      <h2>Attendance Records</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Student Name</th>
            <th>Present</th>
          </tr>
        </thead>
        <tbody>
          ${records
            .map(
              (record) => `
            <tr>
              <td>${record.studentid}</td>
              <td>${record.date}</td>
              <td>${record.fullname}</td>
              <td contenteditable="true" class="attendance-cell" data-studentid="${
                record.studentid
              }" data-date="${record.date}">
                ${record.isPresent ? "Yes" : "No"}
              </td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
      <button class="btn update-attendance-btn">Update Attendance</button> <!-- Submit button -->
    </div>
  `;
    document.body.appendChild(attendanceModal);

    // Add event listener for blur after the modal is displayed and the cells are rendered
    const editableCells = attendanceModal.querySelectorAll(".attendance-cell");
    editableCells.forEach((cell) => {
      cell.addEventListener("blur", (e) => {
        const studentId = e.target.dataset.studentid;
        const date = e.target.dataset.date;
        const isPresent = e.target.innerText === "Yes" ? 1 : 0; // Check if "Yes" or "No" is entered
        console.log("data", studentId, date, isPresent, classId);
        updateAttendance(studentId, date, isPresent, classId); // Update the attendance status
      });
    });

    // Handle click event for "Update Attendance" button
    attendanceModal
      .querySelector(".update-attendance-btn")
      .addEventListener("click", () => {
        const cells = attendanceModal.querySelectorAll(".attendance-cell");
        cells.forEach((cell) => {
          console.log(cell.dataset);
          const studentId = cell.dataset.studentid;
          const date = cell.dataset.date;
          const isPresent = cell.innerText === "Yes" ? 1 : 0;
          console.log("data", studentId, date, isPresent, classId);
          updateAttendance(studentId, date, isPresent, classId);
        });
        alert("Attendance updated successfully.");
        // attendanceModal.remove(); // Optionally close the modal after submitting
      });

    // Close modal when the close button is clicked
    attendanceModal
      .querySelector(".close-attendance-modal")
      .addEventListener("click", () => {
        attendanceModal.remove();
      });
  }

  function displayStudentList(students, classId) {
    const studentModal = document.createElement("div");
    studentModal.classList.add("student-modal");
    studentModal.innerHTML = `
      <div class="student-modal-content">
        <button class="close-student-modal">X</button>
        <h2>Students List</h2>
        <table>
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Student Name</th>
              <th>Present</th>
            </tr>
          </thead>
          <tbody>
            ${students
              .map(
                (student) => ` 
              <tr>
                <td>${student.id}</td>
                <td>${student.fullname}</td>
                <td contenteditable="true" class="attendance-cell" data-studentid="${
                  student.id
                }" data-classid="${classId}" data-date="${
                  new Date().toISOString().split("T")[0]
                }">Yes</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
        <button class="btn mark-attendance" data-classid="${classId}">Submit Attendance</button>
      </div>
    `;
    document.body.appendChild(studentModal);

    // Close the student modal when the close button is clicked
    studentModal
      .querySelector(".close-student-modal")
      .addEventListener("click", () => {
        studentModal.remove();
      });

    // Add event listener to each attendance cell
    const editableCells = studentModal.querySelectorAll(".attendance-cell");
    editableCells.forEach((cell) => {
      cell.addEventListener("blur", (e) => {
        const studentId = e.target.dataset.studentid;
        const date = e.target.dataset.date;
        const isPresent = e.target.innerText === "Present" ? 1 : 0; // If "Present" or "Absent"
        updateAttendance(studentId, date, isPresent, classId); // Update attendance when the user finishes editing the cell
      });
    });

    // Handle click event for "Submit Attendance" button
    studentModal
      .querySelector(".mark-attendance")
      .addEventListener("click", () => {
        const cells = studentModal.querySelectorAll(".attendance-cell");
        cells.forEach((cell) => {
          const studentId = cell.dataset.studentid;
          const date = cell.dataset.date;
          const isPresent = cell.innerText === "Present" ? 1 : 0; // If "Present" or "Absent"
          updateAttendance(studentId, date, isPresent, classId);
        });
        alert("Attendance updated successfully.");
        studentModal.remove(); // Close the modal after submitting attendance
      });
  }

  // Function to update attendance in the database
  function updateAttendance(studentId, date, isPresent, classId) {
    if (!classId || !studentId) {
      alert("Error: Missing required parameters.");
      return;
    }
    fetch("../backend/mark_attendance.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentId: studentId, // Ensure correct studentId is sent
        date: date,
        isPresent: isPresent,
        classId: classId, // Ensure classId is sent as well
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Attendance updated successfully.");
        } else {
          alert("Failed to update attendance.");
        }
      })
      .catch((error) => {
        console.error("Error updating attendance:", error);
        alert("An error occurred. Please try again.");
      });
  }
});
