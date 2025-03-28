const form = document.getElementById("dataForm");
const alerts = {
  success: document.querySelector(".success-alert"),
  error: document.querySelector(".error-alert"),
};

const showAlert = (type, duration = 5000) => {
  Object.values(alerts).forEach((alert) => alert?.classList.add("hidden"));
  const alertElement = alerts[type];
  alertElement?.classList.remove("hidden");

  setTimeout(() => {
    alertElement?.classList.add("hidden");
  }, duration);
};

const handleDownload = async (stationValue, formattedDate) => {
  try {
    const [stationCode, stationName] = stationValue.split("_");
    
    const components = ["BHE", "BHN", "BHZ"];
    const zip = new JSZip();
    let errorFlag = false;

    for (const component of components) {
      const filename = `${formattedDate}.MA.${stationName}.${component}.sac`;
      const response = await fetch(`/home/datos/DatosCompartidos/MASE2.0/sac/${stationCode}_${stationName}/${filename}`);

      if (!response.ok) {
        errorFlag = true;
        continue;
      }
      
      const blob = await response.blob();
      zip.file(filename, blob);
    }

    if (errorFlag) {
      throw new Error("Algunos archivos no se encontraron");
    }

    const content = await zip.generateAsync({ type: "blob" });
    const zipFilename = `${stationName}_${formattedDate}.zip`;
    
    saveAs(content, zipFilename);
    return true;

  } catch (error) {
    console.error("Error en la descarga:", error);
    showAlert("error");
    return false;
  }
};

form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const stationValue = form.station.value.trim();
  const rawDate = form.date.value;

  if (!stationValue || !rawDate) {
    showAlert("error", 3000);
    return;
  }

  const [year, month, day] = rawDate.split("-");
  const formattedDate = `${year}${month.padStart(2, "0")}${day.padStart(2, "0")}000000`;

  try {
    const success = await handleDownload(stationValue, formattedDate);

    if (success) {
      showAlert("success");
      form.reset();
    }
  } catch (error) {
    console.error("Error general:", error);
  }
});