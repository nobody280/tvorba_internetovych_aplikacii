function login(username, password) {
  return fetch("/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    credentials: "include"
  })
    .then((response) => { 
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Invalid credentials"); 
        }
        throw new Error("Error logging in");
      }
      return response.json();    
    })
}


function logout() {
    return fetch("/api/users/logout", {method: "DELETE", credentials: "include"})
      .then((response) => {
        if (!response.ok) {
          if (response.status === 400) {
            throw new Error("Bad request - session does not exist"); 
          }
          throw new Error("Error logging out");
        }
        localStorage.clear();      
      })
}

function register(username, first_name, last_name, password) {
  return fetch("/api/users/register",  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, first_name, last_name, password }),
    credentials: "include"
  })
    .then((response) => { 
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Invalid credentials"); 
        }
        throw new Error("Error logging in");
      }
      return response.json();    
    })
}

export { login, logout, register };