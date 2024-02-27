import AuthContext from '../context/AuthContext';
import React, {useState, useContext} from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import { MDBSelect } from 'mdb-react-ui-kit';

import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBtn,
  MDBBreadcrumb,
  MDBBreadcrumbItem,
  MDBProgress,
  MDBProgressBar,
  MDBIcon,
  MDBListGroup,
  MDBListGroupItem
} from 'mdb-react-ui-kit';

export default function EditProfile() {

    const countries = ["andorra","uae","afghanistan","antigua","anguilla","albania","armenia","angola","argentina","austria","australia",
    "azerbaijan","bosnia","barbados","bangladesh","belgium","burkina-faso","bulgaria","bahrain","burundi","benin","bermuda","brunei",
    "bolivia","brazil","bahamas","bhutan","bouvet-island","botswana","belarus","belize","canada","congo","central-african-republic","congo-brazzaville",
    "switzerland","cote-divoire","chile","cameroon","china","colombia","costa-rica","serbia","cuba","cyprus","czech-republic","germany",
    "djibouti","denmark","dominica","dominican-republic","algeria","ecuador","estonia","egypt","western-sahara","eritrea","spain","ethiopia",
    "finland","fiji","micronesia","faroe-islands","france","gabon","united-kingdom","england","scotland","wales","grenada","georgia",
    "ghana","gibraltar","greenland","gambia","guinea","guadeloupe","equatorial-guinea","greece","sandwich-islands","guatemala","guam",
    "guinea-bissau","guyana","hong-kong","honduras","croatia","haiti","hungary","indonesia","ireland","israel","india",
    "iraq","iran","iceland","italy","jamaica","jordan","japan","kenya","kyrgyzstan","cambodia","kiribati","comoros","saint-kitts-and-nevis",
    "north-korea","south-korea","kuwait","cayman-islands","kazakhstan","laos","lebanon","saint-lucia","liechtenstein","sri-lanka","liberia",
    "lesotho","lithuania","luxembourg","latvia","libya","morocco","monaco","moldova","montenegro","madagascar","marshall-islands","macedonia",
    "mali","burma","mongolia","macau","mauritania","malta","mauritius","maldives","malawi","mexico","malaysia","mozambique","namibia","new-caledonia",
    "niger","norfolk-island","nigeria","nicaragua","netherlands","norway","nepal","nauru","niue","new-zealand","oman","panama","peru","new-guinea",
    "philippines","pakistan","poland","puerto-rico","palestine","portugal","palau","paraguay","qatar","romania","serbia","russia","rwanda",
    "saudi-arabia","solomon-islands","seychelles","sudan","sweden","singapore","slovenia","slovakia","sierra-leone","san-marino","senegal",
    "somalia","suriname","el-salvador","syria","swaziland","caicos-islands","chad","togo","thailand","tajikistan","turkmenistan","tunisia",
    "tonga","turkey","trinidad","tuvalu","taiwan","tanzania","ukraine","uganda","us-minor-islands","united-states","uruguay","uzbekistan",
    "vatican-city","saint-vincent","venezuela","british-virgin-islands","us-virgin-islands","vietnam","vanuatu","samoa","yemen",
    "south-africa","zambia","zimbabwe"]

    const countryChoiceField = document.getElementById("countryInput")
    for(let i = 0 ; i<countries.length; i++){
        //countryChoiceField.appendChild(<option value="${countries[i]}">${countries[i]}</option>)
    }

    let {user} = useContext(AuthContext)
    let [pic, setPic] = useState(null)
    let [flag, setFlag] = useState(null)
    let userID, data = {};

    console.log("user: "+user.user_id)

    React.useEffect(() => {
        fetch(`http://127.0.0.1:8000/api/user/?username=${user.name}`)
            .then(res => res.json())
            .then(data => {
                setPic(data[0].image)
                console.log(pic)
            })
        }, [])

    
    let uploadPic = (e) => {
        //e.preventDefault();
        console.log(document.getElementById('picButton').files[0])
        if (document.getElementById('picButton').files[0]){
            document.getElementById('profile-pic').src = URL.createObjectURL(document.getElementById('picButton').files[0])
        }
    }
    //document.getElementById('picButton').addEventListener("onClick",uploadPic)

    fetch(`http://127.0.0.1:8000/api/user/?username=${user.name}`,{method : 'GET',})
        .then((response) => response.json())
        .then((user) => {
            user = user[0]
            document.getElementById('usernameInput').placeholder = user.username
            document.getElementById('emailInput').value = user.email
            document.getElementById('countryInput').value = user.country
            document.getElementById('nameInput').value = user.first_name
            document.getElementById('lastNameInput').value = user.last_name
            document.getElementById('descriptionInput').value = user.description
            setFlag(user.country)
    });

    let navigate = useNavigate(); 
    let submitClick = async (e) =>{
        e.preventDefault()
        console.log({"email": document.getElementById('emailInput').value,
        "first_name": document.getElementById('nameInput').value,
        "last_name": document.getElementById('lastNameInput').value,
        "description": document.getElementById('descriptionInput').value,
        "country": document.getElementById('countryInput').value,
        "pic": document.getElementById('picButton').files[0] ? document.getElementById('picButton').files[0] : pic
        })

        let formdata = new FormData()
        formdata.append("email",document.getElementById('emailInput').value)
        formdata.append("first_name",document.getElementById('nameInput').value)
        formdata.append("last_name",document.getElementById('lastNameInput').value)
        formdata.append("description",document.getElementById('descriptionInput').value)
        formdata.append("country",document.getElementById('countryInput').value)
        //formdata.append("image",document.getElementById('picButton').files[0])
        formdata.append("image",document.getElementById('picButton').files[0] ? document.getElementById('picButton').files[0] : pic)

        console.log(formdata)

    
        const response = await fetch(`http://127.0.0.1:8000/api/update_user/${user.user_id}`, {
            method: 'POST',
            "Content-Type":"multipart/form-data",
            'body': formdata
        });
            if (!response.ok) {
                throw new Error(`Error! status: ${response.status}`);
            }else{
                //navigate(`/profile/${user.username}`)
            }
        
    }


    return (
        <section className='bg-zinc-950 min-h-[calc(100vh-56px)]'>
        <MDBContainer className="py-5">
            <MDBRow>
            <MDBCol lg="4">
                <MDBCard className="mb-4">
                <MDBCardBody className="text-center">
                    <MDBCardImage
                    alt="profile-pic"
                    id = "profile-pic"
                    className="rounded-circle"
                    style={{ width: '150px' , height: '150px'}}
                    src = {pic ? require('../images/profile-pics/'+pic.split('/')[pic.split('/').length-1]) : null}
                    fluid />
                    <p id="usernameText" className="text-muted mb-4"></p>
                    <MDBCardText id="fullnameText" className="text-muted mb-4"></MDBCardText>
                    <div className="d-flex justify-content-center mb-2">
                    <input type = "file" id="picButton" onChange={() => uploadPic()}></input>
                    </div>
                </MDBCardBody>
                </MDBCard>
            </MDBCol>
            <MDBCol lg="8">
                <MDBCard className="mb-4">
                <MDBCardBody>

                <div class="input-group mb-3">
                    <span class="input-group-text" id="basic-addon1">@</span>
                    <input
                        type="text"
                        class="form-control"
                        id='usernameInput'
                        placeholder="Username"
                        aria-label="Username"
                        aria-describedby="basic-addon1"
                        readOnly
                    />
                </div>

                <div class="input-group mb-3">
                    <input
                        type="email"
                        class="form-control"
                        id = "emailInput"
                        placeholder="Email"
                        aria-label="Email"
                        aria-describedby="basic-addon2"
                    />
                </div>

                <label for="countryInput" class="form-label">Country</label>
                <div class="input-group mb-3">
                    <select id = "countryInput" class="select">
                        {countries.map((country) => (
                            <option value={country}>{country.toLowerCase().replace(/\b\w/g, s => s.toUpperCase())}</option>
                        ))}
                    </select>
                    <i id = "flag" class={"flag flag-"+flag}></i>
                </div>

                <div class="input-group mb-3">
                    <span class="input-group-text">First and last name</span>
                    <input type="text" id="nameInput" aria-label="First name" placeholder='First Name' class="form-control"></input>
                    <input type="text" id = "lastNameInput" aria-label="Last name" placeholder='Last Name' class="form-control"/>
                </div>

                <div class="input-group mb-3">
                    <textarea class="form-control" id="descriptionInput" placeholder="Enter a description for your profile"rows="4"/>
                </div>

                <button type="button" onClick= {submitClick} class="btn btn-primary">Save</button>



                </MDBCardBody>
                </MDBCard>
            </MDBCol>
            </MDBRow>
        </MDBContainer>
        </section>
    );
}