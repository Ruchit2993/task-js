        async function loadProfile() {
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
                const uniqueHobbies = [...new Set(users.flatMap(user => user.hobbies))];
                const uniqueBranches = [...new Set(users.map(user => user.college_branch))];
                const loggedInUser = users.find(user => user.id === loggedInUserId);

                if (loggedInUser) {
                    document.getElementById('userImage').src = loggedInUser.image;
                    document.getElementById('userName').textContent = loggedInUser.name;
                    document.getElementById('userEmail').textContent = loggedInUser.emailid;

                    const form = document.getElementById('profileForm');
                    const nameInput = document.getElementById('name');
                    const emailInput = document.getElementById('emailid');
                    const dobInput = document.getElementById('date_of_birth');
                    const ageInput = document.getElementById('age');
                    const countryInput = document.getElementById('country');
                    const stateInput = document.getElementById('state');
                    const cityInput = document.getElementById('city');
                    const addressInput = document.getElementById('address');
                    const pincodeInput = document.getElementById('pincode');
                    const mobileInput = document.getElementById('mobilenumber');
                    const genderInputs = document.getElementsByName('gender');
                    const hobbiesContainer = document.getElementById('hobbies');
                    const branchInput = document.getElementById('college_branch');
                    const joinDateInput = document.getElementById('college_join_date');
                    const passingYearInput = document.getElementById('passing_year');
                    const collegeNameInput = document.getElementById('college_name');
                    const previewButton = document.getElementById('previewButton');

                    nameInput.value = loggedInUser.name;
                    emailInput.value = loggedInUser.emailid;
                    dobInput.value = loggedInUser.date_of_birth;
                    ageInput.value = calculateAge(loggedInUser.date_of_birth);
                    countryInput.value = loggedInUser.country;
                    stateInput.value = loggedInUser.state;
                    cityInput.value = loggedInUser.city;
                    addressInput.value = loggedInUser.address;
                    pincodeInput.value = loggedInUser.pincode;
                    mobileInput.value = loggedInUser.mobilenumber;
                    genderInputs.forEach(input => {
                        if (input.value === loggedInUser.gender) input.checked = true;
                    });
                    joinDateInput.value = loggedInUser.college_join_date;
                    passingYearInput.value = loggedInUser.passing_year;
                    collegeNameInput.value = loggedInUser.college_name;

                    uniqueHobbies.forEach(hobby => {
                        const div = document.createElement('div');
                        div.className = 'form-check form-check-inline';
                        div.innerHTML = `
              <input class="form-check-input" type="checkbox" name="hobbies" id="hobby${hobby}" value="${hobby}">
              <label class="form-check-label" for="hobby${hobby}">${hobby}</label>
            `;
                        hobbiesContainer.appendChild(div);
                        if (loggedInUser.hobbies.includes(hobby)) {
                            document.getElementById(`hobby${hobby}`).checked = true;
                        }
                    });

                    uniqueBranches.forEach(branch => {
                        const option = document.createElement('option');
                        option.value = branch;
                        option.textContent = branch;
                        if (branch === loggedInUser.college_branch) option.selected = true;
                        branchInput.appendChild(option);
                    });

                    dobInput.addEventListener('change', () => {
                        ageInput.value = calculateAge(dobInput.value);
                    });

                    joinDateInput.addEventListener('change', () => {
                        const joinDate = new Date(joinDateInput.value);
                        const passingYear = joinDate.getFullYear() + 4;
                        passingYearInput.value = passingYear;
                    });

                    document.getElementById('editButton').addEventListener('click', () => {
                        document.getElementById('editForm').classList.toggle('d-none');
                    });

                    form.addEventListener('submit', async (e) => {
                        e.preventDefault();
                        const selectedHobbies = Array.from(document.querySelectorAll('input[name="hobbies"]:checked')).map(input => input.value);
                        const newId = Math.max(...users.map(u => u.id)) + 1;
                        const newUser = {
                            name: nameInput.value,
                            emailid: emailInput.value,
                            date_of_birth: dobInput.value,
                            age: parseInt(ageInput.value),
                            country: countryInput.value,
                            state: stateInput.value,
                            city: cityInput.value,
                            address: addressInput.value,
                            pincode: pincodeInput.value,
                            mobilenumber: mobileInput.value,
                            gender: document.querySelector('input[name="gender"]:checked').value,
                            hobbies: selectedHobbies,
                            college_branch: branchInput.value,
                            college_join_date: joinDateInput.value,
                            passing_year: passingYearInput.value,
                            college_name: collegeNameInput.value,
                            image: loggedInUser.image,
                            id: newId
                        };

                        let updatedUsers = localStorage.getItem('updatedUsers') ? JSON.parse(localStorage.getItem('updatedUsers')) : [];
                        updatedUsers = updatedUsers.filter(u => u.id !== loggedInUserId);
                        updatedUsers.push(newUser);
                        localStorage.setItem('updatedUsers', JSON.stringify(updatedUsers));
                        sessionStorage.setItem('loggedInUserId', newUser.id);
                        previewButton.removeAttribute('disabled');
                        previewButton.href = `user-details.html?id=${newId}`;
                        alert('Profile saved successfully!');
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

        function calculateAge(dob) {
            const birthDate = new Date(dob);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age;
        }

        loadProfile();