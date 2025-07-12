document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("projectForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const projectName = document.getElementById("projectName").value;
      const startDate = document.getElementById("startDate").value;
      const endDate = document.getElementById("endDate").value;
      const description = document.getElementById("description").value;

      const technologies = [];
      ["nodejs", "nextjs", "reactjs", "typescript"].forEach((id) => {
        if (document.getElementById(id).checked) {
          technologies.push(document.getElementById(id).value);
        }
      });

      const imageInput = document.getElementById("imageUpload");
      if (imageInput.files && imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const imageUrl = e.target.result;
          simpanProject(imageUrl);
        };
        reader.readAsDataURL(imageInput.files[0]);
      } else {
        simpanProject("");
      }

      function simpanProject(imageUrl) {
        const projects = JSON.parse(sessionStorage.getItem("projects") || "[]");
        projects.push({
          projectName,
          startDate,
          endDate,
          description,
          technologies,
          imageUrl,
        });
        sessionStorage.setItem("projects", JSON.stringify(projects));
        alert("Project berhasil disimpan!");
        form.reset();
        renderProjects();
      }
    });
  }

  function renderProjects() {
    const projectsGrid = document.querySelector(".projects-grid");
    if (!projectsGrid) return;

    const projects = JSON.parse(sessionStorage.getItem("projects") || "[]");
    projectsGrid.innerHTML = "";

    projects.forEach((project, idx) => {
      const start = new Date(project.startDate);
      const end = new Date(project.endDate);
      let months =
        (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth());
      if (end.getDate() >= start.getDate()) months += 1;
      if (months < 1) months = 1;

      projectsGrid.innerHTML += `
                <div class="project-card">
                    <div class="project-image mobile">
                        ${
                          project.imageUrl
                            ? `<img src="${project.imageUrl}" alt="">`
                            : ""
                        }
                    </div>
                    <div class="project-content">
                        <h3 class="project-title">${project.projectName}</h3>
                        <div class="project-meta">
                            <span class="project-date">durasi: ${months} bulan</span>
                        </div>
                        <p class="project-description">${
                          project.description
                        }</p>
                        <div class="project-icons">
                            <div class="icon"><img src="assets/playstore.png" alt=""></div>
                            <div class="icon"><img src="assets/android-logo.png" alt=""></div>
                            <div class="icon"><img src="assets/java.png" alt=""></div>
                        </div>
                        <div class="project-actions">
                            <button class="btn btn-edit" data-idx="${idx}">edit</button>
                            <button class="btn btn-delete" data-idx="${idx}">delete</button>
                        </div>
                    </div>
                </div>
            `;
    });

    document.querySelectorAll(".project-card").forEach((card, idx) => {
      card.addEventListener("click", function (e) {
        if (
          e.target.classList.contains("btn-edit") ||
          e.target.classList.contains("btn-delete")
        )
          return;
        sessionStorage.setItem("selectedProjectIdx", idx);
        window.location.href = "detail.html";
      });
    });
  }

  renderProjects();
});
