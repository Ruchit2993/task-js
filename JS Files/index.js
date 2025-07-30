    document.getElementById('loginForm').addEventListener('submit', async function (e) {
      e.preventDefault();
      const email = document.getElementById('email').value;
      try {
        const response = await fetch('users.json');
        const users = await response.json();
        const user = users.find(u => u.emailid === email);
        if (user) {
          sessionStorage.setItem('loggedInUserId', user.id);
          window.location.href = 'dashboard.html';
        } else {
          alert('User not found!');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        alert('Error loading user data. Please try again.');
      }
    });