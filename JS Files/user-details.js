    async function loadUserDetails() {
      const urlParams = new URLSearchParams(window.location.search);
      const userId = parseInt(urlParams.get('id'));
      try {
        let users = [];
        const storedUsers = localStorage.getItem('updatedUsers');
        if (storedUsers) {
          users = JSON.parse(storedUsers);
        }
        const jsonResponse = await fetch('users.json');
        const jsonUsers = await jsonResponse.json();
        users = [...users, ...jsonUsers.filter(jsonUser => !users.some(storedUser => storedUser.id === jsonUser.id))];
        const user = users.find(u => u.id === userId);

        if (user) {
          document.getElementById('userImage').src = user.image;
          document.getElementById('userName').textContent = user.name;
          document.getElementById('userAge').textContent = user.age;
          document.getElementById('userGender').textContent = user.gender;
          document.getElementById('userEmail').textContent = user.emailid;
          document.getElementById('userMobile').textContent = user.mobilenumber;
          document.getElementById('userAddress').textContent = user.address;
          document.getElementById('userCity').textContent = user.city;
          document.getElementById('userState').textContent = user.state;
          document.getElementById('userCountry').textContent = user.country;
          document.getElementById('userPincode').textContent = user.pincode;
          document.getElementById('userHobbies').textContent = user.hobbies.join(', ');
          document.getElementById('userCollegeName').textContent = user.college_name;
          document.getElementById('userCollegeBranch').textContent = user.college_branch;
          document.getElementById('userDOB').textContent = user.date_of_birth;
          document.getElementById('userJoinDate').textContent = user.college_join_date;
          document.getElementById('userPassingYear').textContent = user.passing_year;
          document.getElementById('userId').textContent = user.id;
        } else {
          console.error('User not found for ID:', userId);
          window.location.href = 'dashboard.html';
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        window.location.href = 'dashboard.html';
      }
    }

    loadUserDetails();