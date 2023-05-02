const userList = document.querySelector('.userList');
const currentUserInfo = document.querySelector('.currentUser');
const roleOfCurUser = document.querySelector('.roleOfUser');
const currentUser = document.getElementById('principal').innerHTML;

const url = 'http://localhost:8080/api/users';

const elements = {
    editForm: {
        id: document.getElementById('Id'),
        firstName: document.getElementById('FirstName'),
        lastName: document.getElementById('LastName'),
        age: document.getElementById('Age'),
        email: document.getElementById('Email'),
        password: document.getElementById('Password'),
        role: document.getElementById('roles'),
        btnSubmit: document.querySelector('.btnSubmit'),
    },
    deleteForm: {
        id: document.getElementById('delId'),
        firstName: document.getElementById('delFirstName'),
        lastName: document.getElementById('delLastName'),
        age: document.getElementById('delAge'),
        email: document.getElementById('delEmail'),
        password: document.getElementById('delPassword'),
        role: document.getElementById('delRoles'),
        btnDelSubmit: document.querySelector('.btnDelSubmit'),
    },
    createForm: {
        firstName: document.getElementById('firstNameNew'),
        lastName: document.getElementById('lastNameNew'),
        age: document.getElementById('ageNew'),
        email: document.getElementById('emailNew'),
        password: document.getElementById('passwordNew'),
        role: document.querySelector('.roleForNew'),
        btnCreate: document.querySelector('.btnCreate'),
    },
};

// Fetch and render users
fetch(url)
    .then((response) => response.json())
    .then((data) => renderUsers(data));

// Add event listeners
userList.addEventListener('click', onUserListClick);
elements.editForm.btnSubmit.addEventListener('click', onEditFormSubmit);
elements.deleteForm.btnDelSubmit.addEventListener('click', onDeleteFormSubmit);
elements.createForm.btnCreate.addEventListener('click', onCreateFormSubmit);

initializeNavigationTabs();

function renderUsers(users) {
    let allUsers = '';
    let curUser = '';
    let curUserRoles = '';

    users.forEach((user) => {
        const roles = user.roles
            .map((role) => role.role.substring(5))
            .join(' ');
        const userRow = `
      <tr>
          <td>${user.id}</td>
          <td>${user.firstName}</td>
          <td>${user.lastName}</td>
          <td>${user.age}</td>
          <td>${user.email}</td>
          <td>${roles}</td>
          <td>
              <button type="button" id="edit-user" class="btn btn-info text-light">Edit</button>
          </td>
          <td>
              <button type="button" id="delete-user" class="btn btn-danger text-light">Delete</button>
          </td>
      </tr>
    `;

        allUsers += userRow;

        if (user.email === currentUser) {
            curUser = userRow;
            curUserRoles = roles;
        }
    });

    userList.innerHTML = allUsers;
    currentUserInfo.innerHTML = curUser;
    roleOfCurUser.innerHTML = curUserRoles;
}

function onUserListClick(event) {
    const isEditButton = event.target.id === 'edit-user';
    const isDeleteButton = event.target.id === 'delete-user';

    if (isEditButton || isDeleteButton) {
        const parent = event.target.parentElement.parentElement;

        const userData = {
            id: parent.children[0].innerHTML,
            firstName: parent.children[1].innerHTML,
            lastName: parent.children[2].innerHTML,
            age: parent.children[3].innerHTML,
            email: parent.children[4].innerHTML,
            password: parent.children[5].innerHTML,
            roles: parent.children[6].textContent,
        };

        if (isEditButton) {
            openEditModal(userData);
        } else if (isDeleteButton) {
            openDeleteModal(userData);
        }
    }
}

function openEditModal(userData) {
    const {id, firstName, lastName, age, email, password, roles} = userData;
    const {editForm} = elements;

    editForm.id.value = id;
    editForm.firstName.value = firstName;
    editForm.lastName.value = lastName;
    editForm.age.value = age;
    editForm.email.value = email;
    editForm.password.value = password;

    if (roles.startsWith('ADMIN')) {
        editForm.role.children[0].setAttribute('selected', '');
    } else {
        editForm.role.children[1].setAttribute('selected', '');
    }

    $('.editForm #editModal').modal();
}

function onEditFormSubmit() {
    const {id, firstName, lastName, age, email, password, role} = elements.editForm;
    const roles = createRoleArray(role.value);

    fetch(`${url}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: id.value,
            firstName: firstName.value,
            lastName: lastName.value,
            age: age.value,
            email: email.value,
            password: password.value,
            roles: roles,
        }),
    })
        .then((response) => response.json())
        .then(() => location.reload());
}

function openDeleteModal(userData) {
    const {id, firstName, lastName, age, email, password, roles} = userData;
    const {deleteForm} = elements;

    deleteForm.id.value = id;
    deleteForm.firstName.value = firstName;
    deleteForm.lastName.value = lastName;
    deleteForm.age.value = age;
    deleteForm.email.value = email;
    deleteForm.password.value = password;

    if (roles.startsWith('ADMIN')) {
        deleteForm.role.children[0].setAttribute('selected', '');
    } else {
        deleteForm.role.children[1].setAttribute('selected', '');
    }

    $('.delForm #delModal').modal();
}

function onDeleteFormSubmit() {
    const {id} = elements.deleteForm;

    fetch(`${url}/${id.value}`, {
        method: 'DELETE',
    })
        .then((response) => response.json())
        .then(() => location.reload());
}

function onCreateFormSubmit(e) {
    e.preventDefault();
    const {firstName, lastName, age, email, password, role} = elements.createForm;
    const roles = createRoleArray(role.value);

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            firstName: firstName.value,
            lastName: lastName.value,
            age: age.value,
            email: email.value,
            password: password.value,
            roles: roles,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            const dataArr = [];
            dataArr.push(data);
            renderUsers(dataArr);
        })
        .then(() => location.reload())
        .catch((error) => {
            console.error('Error:', error);
            alert('Произошла ошибка при регистрации пользователя. Пожалуйста, попробуйте зарегистрироваться заново.');
        });
}

function createRoleArray(roleValue) {
    const admin = {
        id: 2,
        role: "ROLE_ADMIN",
        authority: "ROLE_ADMIN"
    };

    const user = {
        id: 1,
        role: "ROLE_USER",
        authority: "ROLE_USER"
    };

    let roleArray = [];
    if (roleValue === 'admin') {
        roleArray = [admin, user];
    } else {
        roleArray = [user];
    }

    return roleArray;
}

function initializeEventListeners() {
    elements.userList.addEventListener('click', handleUserListClick);
    elements.btnSubmit.addEventListener('click', onEditFormSubmit);
    elements.btnDelSubmit.addEventListener('click', onDeleteFormSubmit);
    elements.btnCreate.addEventListener('click', onCreateFormSubmit);
    elements.navTabLeft.forEach(onTabClickLeft);
    elements.navTabRight.forEach(onTabClickRight);
}

fetch(url)
    .then((response) => response.json())
    .then((data) => renderUsers(data));

initializeEventListeners();