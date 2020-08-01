import * as moment from 'moment/moment';

export const profilePic = `https://scontent-lht6-1.cdninstagram.com/v/t51.2885-19/44884218_345707102882519_2446069589734326272_n.jpg?_nc_ht=scontent-lht6-1.cdninstagram.com&_nc_ohc=6ojJJfMK2p4AX-SzEhR&oh=b0e0778d21b86852d6396ee22a3302e1&oe=5F47170F&ig_cache_key=YW5vbnltb3VzX3Byb2ZpbGVfcGlj.2`;

export const getTimeStamp = (dateInSeconds) => {
    const date = moment.unix(dateInSeconds);
    return moment(date).fromNow();
}

export const dropzoneStyles = { width:'100%', minHeight:'300px', maxHeight:'500px', textAlign:'center', display:'flex', justifyContent:'center', alignItems:'center' };
export const FFmodalAction = {SHOW_FOLLOWERS:'showFollowers', SHOW_FOLLOWING:'showFollowig'};