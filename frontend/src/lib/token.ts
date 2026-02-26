let inMemoryToken: string | null = null;

export const setToken = (token: string | null) => {
  inMemoryToken = token;
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
};

export const getToken = () => inMemoryToken || localStorage.getItem("token");
