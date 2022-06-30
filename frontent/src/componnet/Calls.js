import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';

const Calls = () => {
    const countShowInPage = 5;
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(0);
    const [callsArr, setCallsArr] = useState([]);
    const [selectPhone, setSelectPhone] = useState(0);
    const [searchPhone, setSearchPhone] = useState('')



    useEffect(() => {
        getCalls();
    }, [page])

    const getCalls = () => {
        axios.get(`http://localhost:5000/callers?page=${page}&countShowInPage=${countShowInPage}`)

            .then(x => {
                setPageSize(x.headers['page-size'])
                setCallsArr(x.data)
            })
            .catch(err => console.log(err))
    }
    const setCalls = () => {
        axios.post(`http://localhost:5000/callers`, { "Phone": searchPhone })
            .then(x => setCallsArr([...callsArr, x.data]))
            .catch(err => console.log(err))
    }

    const UpdateCalls = () => {
        axios.post(`http://localhost:5000/callers/${selectPhone}`, { "Phone": searchPhone })
            .then(x => {
                const copyArr = [...callsArr];
                const index = copyArr.findIndex(x => x.Id == selectPhone);
                copyArr[index].Phone = searchPhone;
                setCallsArr(copyArr);
            })
            .catch(err => console.log(err))
    }

    const deleteCall = () => {
        axios.delete(`http://localhost:5000/callers/${selectPhone}`)
            .then(() => {
                const copyArr = callsArr.filter(x => x.Id != selectPhone);
                setCallsArr(copyArr);
            })
            .catch(err => console.log(err))
    }

    const selectPhon = (target) => {
        setSelectPhone(target.value);
        setSearchPhone(callsArr.find(x => x.Id == target.value).Phone);
    }
    return (
        <Fragment>
            <input value={searchPhone} onChange={({ target }) => setSearchPhone(target.value)} />
            <input type='button' value="הוסף" onClick={setCalls} />
            <input type='button' value="עדכן" onClick={UpdateCalls} />
            <input type='button' value="מחק" onClick={deleteCall} />
            <hr />
            <select value={selectPhone} onChange={({ target }) => { selectPhon(target) }}>
                {callsArr.map(x => <option key={x.Id} value={x.Id}>
                    Phone: {x.Phone}   date: {x.DateCall}
                </option>)}
            </select>
            <hr />
            {page ? <button onClick={() => setPage(page - 1)}>before</button> : null}
            {page + 1} from {Math.ceil(pageSize / countShowInPage)}
            {(page + 1) * countShowInPage <= pageSize ? <button onClick={() => setPage(page + 1)}> next </button> : null}


        </Fragment>
    )
}

export default Calls
