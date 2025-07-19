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
        const checkbox = document.getElementById(id);
        if (checkbox && checkbox.checked) {
          technologies.push(checkbox.value);
        }
      });

      const imageInput = document.getElementById("imageUpload");
      if (imageInput && imageInput.files && imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const imageUrl = e.target.result;
          saveProject(imageUrl);
        };
        reader.readAsDataURL(imageInput.files[0]);
      } else {
        saveProject("");
      }

      function saveProject(imageUrl) {
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

    const filteredProjects = projects.filter((project) => {
      const start = new Date(project.startDate);
      const end = new Date(project.endDate);
      const months =
        (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth());
      return months >= 1;
    });
    const totalDurasi = filteredProjects.reduce((total, project) => {
      const start = new Date(project.startDate);
      const end = new Date(project.endDate);
      let months =
        (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth());
      if (end.getDate() >= start.getDate()) months += 1;
      if (months < 1) months = 1;
      return total + months;
    }, 0);
    // MAP: Loop semua project jadi card
    projectsGrid.innerHTML = filteredProjects
      .map((project, idx) => {
        const start = new Date(project.startDate);
        const end = new Date(project.endDate);
        let months =
          (end.getFullYear() - start.getFullYear()) * 12 +
          (end.getMonth() - start.getMonth());
        if (end.getDate() >= start.getDate()) months += 1;
        if (months < 1) months = 1;

        return `
                <div class="bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col" id="project-grid">
                    
                    <div class="h-48 px-3 rounded flex items-center justify-center mb-4">${ project.imageUrl ? `
                        <img src="${project.imageUrl}" alt="gambar" class="object-contain h-full w-full rounded">`:""}
                    </div>

                    <div class="p-4 flex flex-col flex-grow">
                        <h3 class="text-xl font-semibold text-gray-800 mb-1">${project.projectName}</h3>
                        <span class="text-sm text-gray-500 mb-2 block">${months}</span>
                        <p class="text-gray-700 flex-grow m-px-2">
                            ${project.description}
                        </p>

                        <!-- Tech Icons -->
                        <div class="flex items-center gap-3 mt-4">
                            <img src="assets/image/playstore.png" alt="Play Store" class="w-6 h-6">
                            <img src="assets/image/android-logo.png" alt="Android" class="w-6 h-6">
                            <img src="assets/image/java.png" alt="Java" class="w-6 h-6">
                        </div>

                        <!-- Action Buttons -->
                        <div class="flex justify-center gap-2 mt-4">
                            <button
                                class="bg-black text-white px-12 py-1 rounded hover:bg-gray-500 transition" data-idx="${idx}">Edit</button>
                            <button
                                class="bg-black text-white px-12 py-1 rounded hover:bg-gray-600 transition" data-idx="${idx}">Delete</button>
                        </div>
                    </div>
                </div>
        `;
      })
      .join(""); 
  }

  renderProjects();
});
