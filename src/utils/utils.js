import * as moment from 'moment/moment';

export const profilePic = `https://firebasestorage.googleapis.com/v0/b/react-instagram-clone-3ec83.appspot.com/o/profilePics%2Fdefault-avatar.jpg?alt=media&token=04723c33-78f5-4803-8b71-c8223c7db6ef`;

export const getTimeStamp = (dateInSeconds) => {
    const date = moment.unix(dateInSeconds);
    return moment(date).fromNow();
}

export const dropzoneStyles = { width:'100%', minHeight:'300px', maxHeight:'500px', textAlign:'center', display:'flex', justifyContent:'center', alignItems:'center' };
export const FFmodalAction = {SHOW_FOLLOWERS:'showFollowers', SHOW_FOLLOWING:'showFollowig'};