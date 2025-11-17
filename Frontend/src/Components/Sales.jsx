import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../config";


const localserver = BASE_URL;

export default function Sales() {
    const [total, setTotal] = useState(0);
    const [lastUpdated, setLastUpdated] = useState(null);
    const Navigate = useNavigate();

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const res = await axios.get(`${localserver}/ambika-admin/Sales`);
                
                if (res.data?.totalReceived !== undefined) {
                    setTotal(res.data.totalReceived);
                    setLastUpdated(res.data.lastUpdatedAt);
                }
            } catch (err) {
                console.error("Failed to fetch total sales:", err);
            }
        };

        fetchSales();
    }, []);

    return (
        <div style={{
            width: "100%",
            height: "100vh",
            background: "#F5F5F5",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            fontFamily: "Inter"
        }}>
            <h1 style={{ fontSize: 40, fontWeight: "700", marginBottom: 20 }}>
                Total Sales
            </h1>

            <div style={{
                background: "white",
                padding: "30px 50px",
                borderRadius: 20,
                boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
                textAlign: "center"
            }}>
                <h2 style={{ fontSize: 32, fontWeight: "600" }}>
                    ₹ {Number(total).toFixed(2)}
                </h2>

                {lastUpdated && (
                    <p style={{ marginTop: 10, color: "#666" }}>
                        Last updated: {new Date(lastUpdated).toLocaleString()}
                    </p>
                )}
            </div>

            <div>
                <button onClick={() => Navigate('/ambika-admin/dashboard')} style={{position:'relative', marginTop: 50, marginLeft: 10, height: 50, width: 110, backgroundColor:'#0D0F11',color:'white',border:'none',fontSize:26, borderRadius:10}}>Return</button>
            </div>
        </div>
    );
}
