import React from "react";
import SearchBar from "../SearchBar";

function RawMaterial(){
    return(
        <>
            <div className="control-panel" style={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    width: '100%',
                                                    padding: '1rem',
                                                    paddingLeft: '4rem',
                                                    paddingRight: '4rem',
                                                    paddingTop: '1rem'
                                                    }}>
                <div>
                    <SearchBar />
                </div>
                <div className="right-side-buttons" style={{display:"flex",justifyContent:"space-around",gap:"3rem",marginRight:"0rem"}}>
                    <button style={{border:"none",backgroundColor:"rgb(49,180,117)",borderRadius:"1rem",height:"3rem",width:"9rem"}} onClick={()=>{setAddItems(true)}}>
                        <span style={{color:"white",fontWeight:"600"}}>Add Items</span>
                    </button>
                    <button style={{border:"none",backgroundColor:"rgb(49,180,117)",borderRadius:"1rem",height:"3rem",width:"9rem"}}>
                        <span style={{color:"white",fontWeight:"600"}}>Update Items</span>
                    </button>
                </div>
            </div>
            Raw Material
        </>
    )
}

export default RawMaterial;