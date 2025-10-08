import React from "react";
import {useForm} from "react-hook-form";

const Invitations = ({letter, setLetter}) => {
    const {register, formState: {errors}} = useForm();
    const handleChange = (e) => {
        setLetter({...letter, data: {
        ...letter.data, [e.target.name]: e.target.value}
        });
    }
    return (
        <React.Fragment>
            <div className="form-group">
                <label className="form-label" htmlFor="to">Kepada</label>
                <div className="form-control-wrap">
                    <input
                        type="text"
                        className="form-control"
                        name="to"
                        placeholder="Ex. Bapak/Ibu Guru MTs. Darul Hikmah Menganti"
                        {...register("to", {
                            required: true,
                            onChange: (e) => handleChange(e)
                        })}
                    />
                    {errors.to && <span className="invalid">Kolom tidak boleh kosong</span>}
                </div>
            </div>
            <div className="form-group col-md-6">
                <label className="form-label" htmlFor="date">Tanggal</label>
                <div className="form-control-wrap">
                    <input
                        type="text"
                        className="form-control"
                        name="date"
                        {...register("date", {
                            required: true,
                            onChange: (e) => handleChange(e)
                        })}
                    />
                    {errors.date && <span className="invalid">Kolom tidak boleh kosong</span>}
                </div>
            </div>
            <div className="form-group col-md-6">
                <label className="form-label" htmlFor="time">Waktu</label>
                <div className="form-control-wrap">
                    <input
                        type="text"
                        className="form-control"
                        name="time"
                        {...register("time", {
                            required: true,
                            onChange: (e) => handleChange(e)
                        })}
                    />
                    {errors.time && <span className="invalid">Kolom tidak boleh kosong</span>}
                </div>
            </div>
            <div className="form-group col-md-6">
                <label className="form-label" htmlFor="place">Tempat</label>
                <div className="form-control-wrap">
                    <input
                        type="text"
                        className="form-control"
                        name="place"
                        {...register("place", {
                            required: true,
                            onChange: (e) => handleChange(e)
                        })}
                    />
                    {errors.place && <span className="invalid">Kolom tidak boleh kosong</span>}
                </div>
            </div>
            <div className="form-group col-md-6">
                <label className="form-label" htmlFor="event">Acara</label>
                <div className="form-control-wrap">
                    <input
                        type="text"
                        className="form-control"
                        name="event"
                        {...register("event", {
                            required: true,
                            onChange: (e) => handleChange(e)
                        })}
                    />
                    {errors.event && <span className="invalid">Kolom tidak boleh kosong</span>}
                </div>
            </div>
            <div className="form-group col-md-12">
                <label className="form-label" htmlFor="costume">Seragam</label>
                <div className="form-control-wrap">
                    <input
                        type="text"
                        className="form-control"
                        name="costume"
                        {...register("costume", {
                            required: false,
                            onChange: (e) => handleChange(e)
                        })}
                    />
                </div>
            </div>
            <div className="form-group col-md-12">
                <label className="form-label" htmlFor="description">Keterangan</label>
                <div className="form-control-wrap">
                    <textarea
                        className="form-control"
                        name="description"
                        {...register("description", {
                            required: false,
                            onChange: (e) => handleChange(e)
                        })}
                    />
                </div>
            </div>
        </React.Fragment>
    )
}

export default Invitations;