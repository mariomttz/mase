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
    
    // Nuevo formato de nombre de archivo
    const filename = `${formattedDate}.${stationName}.png`;
    
    // Nueva ruta de descarga
    const response = await fetch(`/png/${stationCode}_${stationName}/${filename}`);

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    // Descarga directa del PNG
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

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

  // Formatear fecha eliminando guiones
  const formattedDate = rawDate.replace(/-/g, "") + "000000";

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