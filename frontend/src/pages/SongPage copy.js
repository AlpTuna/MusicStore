import React, {useContext, useState} from 'react'
import AuthContext from '../context/AuthContext';
import { useParams } from 'react-router-dom'

import {MDBCol,MDBContainer,MDBRow,MDBCard,MDBCardText,MDBCardBody,MDBCardImage,MDBBtn,MDBBreadcrumb,MDBBreadcrumbItem,MDBProgress,
    MDBProgressBar,MDBIcon,MDBListGroup,MDBListGroupItem} from 'mdb-react-ui-kit';
import { Typography } from '@mui/material';



const SongPage = () => {
    let { id } = useParams();
    let {user} = useContext(AuthContext)
    var keys = [];
    let [vals, setVals] = useState([])
    let [likes, setLikes] = useState(false)
    
    React.useEffect(() => {
        fetch('http://127.0.0.1:8000/api/get_music/'+id)
        .then(res => res.json())
        .then(data => {
            setVals(data);
            //setLikes(data.likes.includes(user.user_id))
            setLikes(false)
        })
    }, [])
    console.log(vals)
    console.log(user)

    let cartButtonClick = async(e) =>{
        e.preventDefault()
        console.log("Add to cart clicked", document.getElementById("licenseSelect").value)

        const response = await fetch('http://127.0.0.1:8000/api/update_cart/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            'body': JSON.stringify({"userID" : user.user_id,
                                    "licenseID" : document.getElementById("licenseSelect").value})
        });
            if (!response.ok) {
                throw new Error(`Error! status: ${response.status}`);
            }else{
                //navigate(`/profile/${user.username}`)
            }  
        
    }

    let submitClick = async (e) =>{
        e.preventDefault()
        console.log({"context":document.getElementById("commentInput").value,
                    "userID" : user.user_id,
                    "songID" : vals.id
        })
        
        const response = await fetch('http://127.0.0.1:8000/api/add_comment/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            'body': JSON.stringify({"context":document.getElementById("commentInput").value,
                                    "userID" : user.user_id,
                                    "songID" : vals.id})
        });
            if (!response.ok) {
                throw new Error(`Error! status: ${response.status}`);
            }else{
                //navigate(`/profile/${user.username}`)
            }   
    }

    

return (
    <section style={{ backgroundColor: '#eee' }}>
        <MDBContainer className="py-5">
            <MDBRow>
            <MDBCol lg="4">
                <MDBCard className="mb-4">
                <MDBCardBody className="text-center">
                    <MDBCardImage
                    alt="cover-picture"
                    id = "cover-pic"
                    //className="rounded-circle"
                    src={vals && vals.image ? require("../images/music-pics/"+vals.image.split('/')[vals.image.split('/').length-1]): null} //If statement is for the synchronization issues
                    style={{ width: '250px' , height: '250px'}}
                    fluid />
                    <hr />
                    <h4 id="TitleText" >{vals ? `${vals.title}`: null}</h4>
                    <a id="ArtistText" href = {`/profile/${vals && vals.user_obj ? `${vals.user_obj.username}`: null}`} >{vals && vals.user_obj ? `${vals.user_obj.username}`: null}</a>
                    <MDBCardText id="genreText" className="text-muted mb-4">{vals ? `${vals.genre}` : null}</MDBCardText>

                    <section class="text-center">
                        <div class="row">
                            <div class="col-lg-3 col-md-6 mb-5 mb-md-5 mb-lg-0 position-relative">
                            <h5 class="text-primary fw-bold mb-3">0</h5>
                            <h6 class="fw-normal mb-0">Plays</h6>
                            <div class="vr vr-blurry position-absolute my-0 h-100 d-none d-md-block top-0 end-0"></div>
                            </div>

                            <div class="col-lg-3 col-md-6 mb-5 mb-md-5 mb-lg-0 position-relative">
                            <h5 class="text-primary fw-bold mb-3"><i class={`${likes ? "fas" : "far"} fa-heart`}></i></h5>
                            <h6 class="fw-normal mb-0">{vals && vals.likes_obj ? vals.likes_obj.length : null}</h6>
                            <div class="vr vr-blurry position-absolute my-0 h-100 d-none d-md-block top-0 end-0"></div>
                            </div>

                            <div class="col-lg-3 col-md-6 mb-5 mb-md-5 mb-lg-0 position-relative">
                            <h5 href = "/" class="text-primary fw-bold mb-3"><i class="fas fa-plus"></i></h5>
                            <h6 class="fw-normal mb-0">Add</h6>
                            <div class="vr vr-blurry position-absolute my-0 h-100 d-none d-md-block top-0 end-0"></div>
                            </div>                            
                        </div>


                    </section>
                    <hr />

                    <div class="d-flex align-items-start bg-light mb-3">
                            <div class = "row">
                                <button type="button" class="btn btn-outline-dark btn-rounded btn-sm"
                                    data-mdb-ripple-color="dark">{vals && vals.tag1 ? `#${vals.tag1}   ` : null}
                                </button>
                            </div>
                            <div class = "row">
                                <button type="button" class="btn btn-outline-dark btn-rounded btn-sm"
                                    data-mdb-ripple-color="dark">{vals && vals.tag2 ? `#${vals.tag2}   ` : null}
                                </button>
                            </div>
                            <div class = "row">
                                <button type="button" class="btn btn-outline-dark btn-rounded btn-sm"
                                    data-mdb-ripple-color="dark">{vals && vals.tag3 ? `#${vals.tag3}   ` : null}
                                </button>
                            </div>
                    </div>


                </MDBCardBody>
                </MDBCard>

                <MDBCard className="mb-4 mb-lg-0">
                <MDBCardBody className="p-0">
                    <MDBListGroup flush className="rounded-3">
                    <MDBListGroupItem className="d-flex justify-content-between align-items-center p-3">
                        <MDBCardText id= "descriptionText">{vals ? vals.description : null}</MDBCardText>
                    </MDBListGroupItem>
                    </MDBListGroup>
                </MDBCardBody>
                </MDBCard>
            </MDBCol>
            <MDBCol lg="8">
                <MDBCard className="mb-12">
                <MDBCardBody>
                <div class="btn-group">
                    {vals && vals.licences ? vals.licences.map((license) => (
                    <MDBRow className="mb-2">
                            <Typography>{license.license_obj.name}</Typography>
                            <Typography>{license.price} $</Typography>
                            <Typography>License 1 Included files</Typography>
                    </MDBRow> 
                    )) : null}
                    </div>
                    <select id="licenseSelect">
                        {vals && vals.licences ? vals.licences.map((license) => (
                                <option value = {license.id}>{license.license_obj.name}</option>
                        )) : null}
                    </select>
                    <button onClick={cartButtonClick}>Add to Cart</button>
                </MDBCardBody>
                <hr/>
                <MDBCardBody>
                    <h2>Comments</h2>
                    {vals && vals.comments_obj ? vals.comments_obj.length > 0 ? vals.comments_obj.map((comment) => (
                        <MDBRow className="mb-2">
                        <a href="#!">
                            {comment.user_obj.picture ? <img src={require("../images/profile-pics/"+comment.user_obj.picture.split('/')[comment.user_obj.picture.split('/').length-1])} 
                            alt="avatar" class="img-fluid rounded-circle me-3" width="35"/> : null}
                        </a>
                                <p>{comment.user_obj.username} :{comment.context}</p>
                        </MDBRow>)) 
                        : <MDBRow className='mb-2'><p>No comment found</p></MDBRow>
                    : null }
                    <input id = "commentInput" name = "commentInput" type="text" class="form-control"></input>
                    <br/>
                    <button type="button" onClick = {submitClick} class="btn btn-primary">Comment</button>


                </MDBCardBody>
                </MDBCard>
            </MDBCol>
            </MDBRow>
        </MDBContainer>
    </section>
    )
}

export default SongPage