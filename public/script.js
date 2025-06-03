document.querySelector('input[name="dob"]').addEventListener('change', function () {
    const dob = new Date(this.value);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
  
    if (age < 5 || age > 120) {
      alert("Age must be between 5 and 120.");
      document.getElementById('age').value = "";
    } else {
      document.getElementById('age').value = age;
    }
  });
  
document.getElementById('surveyForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  // Get field elements
  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const contact = document.getElementById('contact');
  const age = document.getElementById('age');

  // Validate required fields
  const isNameValid = name.classList.contains('valid');
  const isEmailValid = email.classList.contains('valid');
  const isContactValid = contact.classList.contains('valid');
  const ageValue = parseInt(age.value.trim());
  const isAgeValid = !isNaN(ageValue) && ageValue >= 5 && ageValue <= 120;

  // If any field is invalid or age is empty
  if (!isNameValid || !isEmailValid || !isContactValid || !isAgeValid) {
    alert("Please correct all errors and ensure a valid age is calculated before submitting.");
    return;
}

  // Proceed with submission
  const formData = new FormData(e.target);
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    age: parseInt(document.getElementById('age').value),
    dob: formData.get('dob'),
    contact: formData.get('contact'),
    food: formData.getAll('food'),
    eatOut: parseInt(formData.get('eatOut')),
    watchMovies: parseInt(formData.get('watchMovies')),
    watchTV: parseInt(formData.get('watchTV')),
    listenRadio: parseInt(formData.get('listenRadio')),
  };

  const res = await fetch('/submit-survey', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (res.ok) {
    alert("Survey submitted!");
    e.target.reset();

    // Optional: Clear validation styles
    name.classList.remove('valid');
    email.classList.remove('valid');
    contact.classList.remove('valid');
    document.getElementById('age').value = "";
  } else {
    alert("Submission failed.");
  }
});


  // === Real-Time Input Validation ===
function validateName() {
  const nameInput = document.getElementById('name');
  const error = document.getElementById('name-error');
  const valid = /^[a-zA-Z\s]+$/.test(nameInput.value);
  
  if (nameInput.value.trim() === '') {
    nameInput.classList.remove('valid', 'invalid');
    error.textContent = '';
  } else if (valid) {
    nameInput.classList.add('valid');
    nameInput.classList.remove('invalid');
    error.textContent = '';
  } else {
    nameInput.classList.add('invalid');
    nameInput.classList.remove('valid');
    error.textContent = 'Name can only contain letters and spaces.';
  }
}

function validateEmail() {
  const emailInput = document.getElementById('email');
  const error = document.getElementById('email-error');
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value);

  if (emailInput.value.trim() === '') {
    emailInput.classList.remove('valid', 'invalid');
    error.textContent = '';
  } else if (valid) {
    emailInput.classList.add('valid');
    emailInput.classList.remove('invalid');
    error.textContent = '';
  } else {
    emailInput.classList.add('invalid');
    emailInput.classList.remove('valid');
    error.textContent = 'Please enter a valid email address.';
  }
}

function validateContact() {
  const contactInput = document.getElementById('contact');
  const error = document.getElementById('contact-error');
  const valid = /^0\d{9}$/.test(contactInput.value);

  if (contactInput.value.trim() === '') {
    contactInput.classList.remove('valid', 'invalid');
    error.textContent = '';
  } else if (valid) {
    contactInput.classList.add('valid');
    contactInput.classList.remove('invalid');
    error.textContent = '';
  } else {
    contactInput.classList.add('invalid');
    contactInput.classList.remove('valid');
    error.textContent = 'Enter a valid 10-digit SA number starting with 0.';
  }
}

// === Attach Events ===
document.getElementById('name').addEventListener('input', validateName);
document.getElementById('email').addEventListener('input', validateEmail);
document.getElementById('contact').addEventListener('input', validateContact);

  