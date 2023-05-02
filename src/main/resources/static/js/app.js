const userList = document.querySelector('.userList')

const getId = document.getElementById('Id')
const getFirstName = document.getElementById('FirstName')
const getLastName = document.getElementById('LastName')
const getAge = document.getElementById('Age')
const getEmail = document.getElementById('Email')
const getPassword = document.getElementById('Password')
const getRole = document.getElementById('roles')

const getDelId = document.getElementById('delId')
const getDelFirstName = document.getElementById('delFirstName')
const getDelLastName = document.getElementById('delLastName')
const getDelAge = document.getElementById('delAge')
const getDelEmail = document.getElementById('delEmail')
const getDelPassword = document.getElementById('delPassword')
const getDelRole = document.getElementById('delRoles')

const btnSubmit = document.querySelector('.btnSubmit')
const btnDelSubmit = document.querySelector('.btnDelSubmit')
const url = 'http://localhost:8080/api/users'

let allUsers = ''
let curUser = ''
let curUserRoles = ''
const currentUserInfo = document.querySelector('.currentUser')
let currentUser = document.getElementById('principal').innerHTML


const renderUsers = (users) => {
    users.sort((a, b) => a.id - b.id);
    users.forEach(user => {
        allUsers += `
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.firstName}</td>
                            <td>${user.lastName}</td>
                            <td>${user.age}</td>
                            <td>${user.email}</td>
                            <td>${user.roles.length < 2 ?
            user.roles[0].role.substring(5) :
            user.roles[0].role.substring(5) + ' ' +
            user.roles[1].role.substring(5)}

                            </td>
                            <td>
                                <button type="button" id="edit-user" 
                                class="btn btn-info text-light">Edit
                                </button>
                            </td>
                            <td>
                                <button type="button" id="delete-user" 
                                class="btn btn-danger text-light">Delete
                                </button>
                            </td>
                        </tr>
                        `
    })
    const roleOfCurUser = document.querySelector('.roleOfUser')
    users.forEach(user => {
        if (user.email === currentUser) {
            user.roles.forEach(role => {
                curUserRoles += role.role.substring(5) + ' '
            })
            curUser += `
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.firstName}</td>
                            <td>${user.lastName}</td>
                            <td>${user.age}</td>
                            <td>${user.email}</td>
                            <td>${curUserRoles}</td>
                        </tr>
                    `
            roleOfCurUser.innerHTML = curUserRoles
            currentUserInfo.innerHTML = curUser
        }
        userList.innerHTML = allUsers
    })
}

fetch(url)
    .then(response => response.json())
    .then(data => renderUsers(data))
    .then(data => {
        localStorage.setItem('activeTab', 'admin');
    })


const navTabLeft = document.querySelectorAll('.nav-link.leftNav')
const navTabRight = document.querySelectorAll('.nav-link.rightNav')

navTabLeft.forEach(onTabCLickLeft)
navTabRight.forEach(onTabCLickRight)


function onTabCLickLeft(item) {
    item.addEventListener('click', function () {
        let cardId = item.getAttribute('href')
        const pillAdmin = document.querySelector('.pillAdmin')
        const pillUser = document.querySelector('.pillUser')

        if (!item.classList.contains('active')) {
            navTabLeft.forEach(item => {
                item.classList.remove('active')
            })
            item.classList.add('active')
        }


        if (cardId === '#userPanel') {
            pillAdmin.classList.remove('active')
            pillUser.classList.add('active')
        } else {
            pillUser.classList.remove('active')
            pillAdmin.classList.add('active')
        }

    })
}

function onTabCLickRight(item) {
    item.addEventListener('click', function () {
        let cardId = item.getAttribute('href')
        const tabAdmin = document.querySelector('.tabAdmin')
        const tabCreate = document.querySelector('.tabCreate')
        if (!item.classList.contains('active')) {
            navTabRight.forEach(item => {
                item.classList.remove('active')
            })
            item.classList.add('active')
        }
        if (cardId === '#create') {
            tabAdmin.classList.remove('active')
            tabCreate.classList.add('active')
        } else {
            tabCreate.classList.remove('active')
            tabAdmin.classList.add('active')
        }
    })
}


userList.addEventListener('click', (event) => {
    let editButtonPressed = event.target.id === 'edit-user'
    let deleteButtonPressed = event.target.id === 'delete-user'
    const parent = event.target.parentElement.parentElement
    let id = parent.children[0].innerHTML
    let email = parent.children[4].innerHTML
    let password = parent.children[5].innerHTML

    if (editButtonPressed) {
        getId.value = id
        getFirstName.value = parent.children[1].innerHTML
        getLastName.value = parent.children[2].innerHTML
        getAge.value = parent.children[3].innerHTML
        getEmail.value = email
        getPassword.value = password

        $('.editForm #editModal').modal()

        if (parent.children[6].textContent.startsWith('ADMIN')) {
            getRole.children[0].setAttribute('selected', '')
        } else {
            getRole.children[1].setAttribute('selected', '')
        }

        btnSubmit.addEventListener('click', () => {
            const admin = {
                id: 2,
                role: "ROLE_ADMIN",
                authority: "ROLE_ADMIN"
            }

            const user = {
                id: 1,
                role: "ROLE_USER",
                authority: "ROLE_USER"
            }
            let role = []
            if (getRole.value === 'admin') {
                role[0] = admin
                role[1] = user
            } else {
                role[0] = user
            }
            fetch(`${url}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: id,
                    firstName: getFirstName.value,
                    lastName: getLastName.value,
                    age: getAge.value,
                    email: getEmail.value,
                    password: getPassword.value,
                    roles: role
                })
            })
                .then(response => response.json())
        })

    } else if (deleteButtonPressed) {
        getDelId.value = id
        getDelFirstName.value = parent.children[1].innerHTML
        getDelLastName.value = parent.children[2].innerHTML
        getDelAge.value = parent.children[3].innerHTML
        getDelEmail.value = email
        getDelPassword.value = password

        if (parent.children[6].textContent.startsWith('ADMIN')) {
            getDelRole.children[0].setAttribute('selected', '')
        } else {
            getDelRole.children[1].setAttribute('selected', '')
        }

        $('.delForm #delModal').modal()

        btnDelSubmit.addEventListener('click', () => {
            fetch(`${url}/${id}`, {
                method: 'DELETE'
            })
                .then(response => response.json())
        })
    }
})

const newFirstName = document.getElementById('firstNameNew')
const newLastName = document.getElementById('lastNameNew')
const newAge = document.getElementById('ageNew')
const newEmail = document.getElementById('emailNew')
const newPassword = document.getElementById('passwordNew')

const btnCreate = document.querySelector('.btnCreate')
const selectNewRole = document.querySelector('.roleForNew')

btnCreate.addEventListener('click', (e) => {
    e.preventDefault()
    const admin = {
        id: 2,
        role: "ROLE_ADMIN",
        authority: "ROLE_ADMIN"
    }

    const user = {
        id: 1,
        role: "ROLE_USER",
        authority: "ROLE_USER"
    }
    let role = []
    if (selectNewRole.value === 'admin') {
        role[0] = admin
        role[1] = user
    } else {
        role[0] = user
    }

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            firstName: newFirstName.value,
            lastName: newLastName.value,
            age: newAge.value,
            email: newEmail.value,
            password: newPassword.value,
            roles: role
        })
    })
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('activeTab', 'admin');
            location.reload();
        })
        .catch(error => {
            console.error('Error:', error)
            alert('Произошла ошибка при регистрации пользователя. Пожалуйста, попробуйте зарегистрироваться заново.')
        })
})


document.addEventListener('DOMContentLoaded', () => {
    const activeTab = localStorage.getItem('activeTab');

    if (activeTab === 'admin') {
        const adminTab = document.querySelector('.nav-link.leftNav[href="#adminPanel"]');
        adminTab.click();
        const userTableTab = document.querySelector('.nav-link.rightNav[href="#admin"]');
        userTableTab.click();
    }
    localStorage.removeItem('activeTab');
});



