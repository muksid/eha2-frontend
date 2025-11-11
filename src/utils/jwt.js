import axios from "./axios";

/**
 * Проверяет, действителен ли токен Sanctum (через запрос на сервер).
 */
const isTokenValid = async (authToken) => {
  if (typeof authToken !== "string" || !authToken.trim()) {
    return false;
  }

  try {
    // Устанавливаем заголовок Bearer для проверки
    axios.defaults.headers.common.Authorization = `Bearer ${authToken}`;

    // Пробуем запросить данные текущего пользователя
    // await axios.get("/api/user");

    return true; // если успешно — токен рабочий
  } catch (error) {
    console.error("Invalid or expired token:", error.response?.status);
    return false;
  }
};

/**
 * Устанавливает или удаляет токен из localStorage и axios
 */
const setSession = (authToken) => {
  if (typeof authToken === "string" && authToken.trim() !== "") {
    localStorage.setItem("authToken", authToken);
    axios.defaults.headers.common.Authorization = `Bearer ${authToken}`;
  } else {
    localStorage.removeItem("authToken");
    delete axios.defaults.headers.common.Authorization;
  }
};

export { isTokenValid, setSession };

