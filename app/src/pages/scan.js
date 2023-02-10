import QrReader from 'react-qr-scanner';
import { useState, useEffect } from 'react'
import '../static/css/qrcode.scss'
import { useHistory } from "react-router-dom";
import * as atoms from '../store/atoms'
import { useSetRecoilState } from 'recoil'

function QrCode(props) {

    const [scanError, setScanError] = useState('')
    const history = useHistory()
    const [query, setQuery] = useState('')

    const setValue = useSetRecoilState(atoms[props.location.query?.value] || atoms.fall)


    useEffect(() => {
        if (props.location.query) {
            setQuery(props.location.query)
        }
        else {
            history.push('/')
        }
    }, [])

    function qrError(error) {
        console.log("scan failed");
        setScanError(error)
    }

    function qrScan(dt) {
        console.log("scanning");
        if (dt) {
            console.log("scanned");

            setValue(dt)
            setTimeout(() => {
                history.push(query.returnAddress)
            }, 0);
        } else {
            console.log("scanning - not succcesful");
        }
    }


    return (<div className="container my-4 px-0" >
        <div id="scanner">
            <QrReader
                delay={500}
                onError={qrError}
                onScan={qrScan}
            />
        </div>

        {scanError && <div className="my-4">
            <p>scanError</p>
        </div>
        }

    </div>)
}

export default QrCode