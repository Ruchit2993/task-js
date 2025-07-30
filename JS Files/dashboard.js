    async function loadDashboard() {
      const loggedInUserId = parseInt(sessionStorage.getItem('loggedInUserId'));
      try {
        let users = [];
        const storedUsers = localStorage.getItem('updatedUsers');
        if (storedUsers) {
          users = JSON.parse(storedUsers);
        }
        const jsonResponse = await fetch('users.json');
        const jsonUsers = await jsonResponse.json();
        users = [...users, ...jsonUsers.filter(jsonUser => !users.some(storedUser => storedUser.id === jsonUser.id))];
        const loggedInUser = users.find(user => user.id === loggedInUserId);

        if (loggedInUser) {
          document.getElementById('userName').textContent = loggedInUser.name;
          const nameParts = loggedInUser.name.split(' ');
          const initials = nameParts[0][0] + (nameParts[1] ? nameParts[1][0] : nameParts[0][1]);
          document.getElementById('userAvatar').textContent = initials.toUpperCase();

          const userCardsContainer = document.getElementById('userCards');
          users
            .filter(user => user.id !== loggedInUserId)
            .forEach(user => {
              const card = document.createElement('div');
              card.className = 'col-md-4 mb-4';
              card.innerHTML = `
                <div class="card h-100">
                  <div class="card-body">
                    <img src="${user.image}" class="card-img-top rounded-circle mx-auto float-start" style="width: 150px; height: 150px; object-fit: cover;" alt="${user.name}">
                    <p class="card-text">
                    <h5 class="card-title">${user.name}</h5>
                    <strong>Email:</strong> ${user.emailid}<br>
                      <strong>College:</strong> ${user.college_name}<br>
                      <strong>Branch:</strong> ${user.college_branch}
                    </p>
                  </div>
                </div>
              `;
              card.addEventListener('click', () => {
                window.location.href = `user-details.html?id=${user.id}`;
              });
              userCardsContainer.appendChild(card);
            });

          document.getElementById('logout').addEventListener('click', () => {
            sessionStorage.removeItem('loggedInUserId');
            window.location.href = 'index.html';
          });
        } else {
          console.error('User not found for ID:', loggedInUserId);
          window.location.href = 'index.html';
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        window.location.href = 'index.html';
      }
    }

    loadDashboard();