import React, { useEffect } from 'react'
import { useDropzone } from 'react-dropzone';
import { dropzoneStyles } from '../utils/utils';

const getClassName = (className, isActive) => !isActive ? `${className}` : `${className}-active`;

export const Dropzone = ({ onDrop, accept, setIsDragging }) => {

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept });


    useEffect(() => setIsDragging(isDragActive), [isDragActive]);

    return (
        <div className={getClassName('dropzone', isDragActive)} {...getRootProps()} style={dropzoneStyles}>
            <input type="text" className="dropzone-input" {...getInputProps({ multiple: false })} />
            <div>
                {isDragActive ?
                    <div>
                        <p className="dropzone-content" style={{ color: '#11ff', fontSize: '20px' }}>Drop file here!</p>
                        <i className="material-icons" style={{ color: '#11ff', fontSize: '80px' }}>backup</i>
                    </div> :
                    <div style={{cursor:'pointer'}}>
                        <p className="dropzone-content" style={{ color: 'black', fontSize: '20px' }}>Drag 'n' drop some file here, or click to select files</p>
                        <i className="material-icons" style={{ color: 'black', fontSize: '80px' }}>backup</i>
                    </div>
                }
            </div>
        </div>
    )
}
