
const form = document.getElementById("reportForm");
const subjects = document.getElementById("subjects");
const report = document.getElementById("report");

// Add a new subject row
document.getElementById("addSubject").addEventListener("click", function () {
  const row = document.createElement("div");
  row.className = "subject-row";

  const name = document.createElement("input");
  name.type = "text";
  name.className = "subject-name";
  name.placeholder = "Subject name";
  name.required = true;
  name.setAttribute("aria-label", "Subject name");

  const marks = document.createElement("input");
  marks.type = "number";
  marks.className = "subject-mark";
  marks.placeholder = "Marks / 100";
  marks.min = "0";
  marks.max = "100";
  marks.step = "1";
  marks.required = true;
  marks.setAttribute("aria-label", "Subject marks");

  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "remove-btn";
  remove.textContent = "×";
  remove.setAttribute("aria-label", "Remove subject");

  row.append(name, marks, remove);
  subjects.appendChild(row);
});

// Remove a subject row; keep at least one
subjects.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove-btn")) {
    if (subjects.querySelectorAll(".subject-row").length > 1) {
      event.target.closest(".subject-row").remove();
    } else {
      alert("At least one subject is required.");
    }
  }
});

// Generate the report
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("studentName").value.trim();
  const regNo = document.getElementById("registerNo").value.trim();
  const course = document.getElementById("course").value.trim();
  const semester = document.getElementById("semester").value;

  const rows = [...subjects.querySelectorAll(".subject-row")];
  const data = [];

  for (const row of rows) {
    const subject = row.querySelector(".subject-name").value.trim();
    const input = row.querySelector(".subject-mark");
    const mark = input.valueAsNumber;

    if (!subject || input.value === "" ||
        !Number.isFinite(mark) || mark < 0 || mark > 100 ||
        !Number.isInteger(mark)) {
      alert("Enter each subject name and whole-number marks from 0 to 100.");
      input.focus();
      return;
    }

    data.push({ subject, mark });
  }

  const total = data.reduce((sum, item) => sum + item.mark, 0);
  const maximum = data.length * 100;
  const percentage = (total / maximum) * 100;

  // Assumption: each subject requires at least 35/100 to pass.
  const passed = data.every(item => item.mark >= 35);
  const overall = passed ? "Pass" : "Fail";

  // Display student details safely
  const details = document.getElementById("studentDetails");
  details.replaceChildren();

  [
    ["Name", name],
    ["Register Number", regNo],
    ["Course", course],
    ["Semester", semester]
  ].forEach(([label, value]) => {
    const line = document.createElement("p");
    const strong = document.createElement("strong");
    strong.textContent = label + ": ";
    line.append(strong, document.createTextNode(value));
    details.appendChild(line);
  });

  // Display subject-wise marks
  const resultRows = document.getElementById("resultRows");
  resultRows.replaceChildren();

  data.forEach(item => {
    const row = document.createElement("tr");
    const subjectCell = document.createElement("td");
    const marksCell = document.createElement("td");
    const resultCell = document.createElement("td");

    subjectCell.textContent = item.subject;
    marksCell.textContent = item.mark + " / 100";
    resultCell.textContent = item.mark >= 35 ? "Pass" : "Fail";

    row.append(subjectCell, marksCell, resultCell);
    resultRows.appendChild(row);
  });

  document.getElementById("totalMarks").textContent =
    `${total} / ${maximum}`;

  document.getElementById("percentage").textContent =
    percentage.toFixed(2) + "%";

  document.getElementById("overallResult").textContent = overall;

  report.hidden = false;
  report.scrollIntoView({ behavior: "smooth" });
});

document.getElementById("printBtn").addEventListener("click", function () {
  window.print();
});