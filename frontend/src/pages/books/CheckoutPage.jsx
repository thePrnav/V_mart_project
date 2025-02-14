// chatgpt


import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCreateOrderMutation } from '../../redux/features/orders/ordersApi';
import Swal from 'sweetalert2';

const CheckoutPage = () => {
    const cartItems = useSelector(state => state.cart.cartItems);
    const totalPrice = cartItems.reduce((acc, item) => acc + item.newPrice, 0); // Ensure this remains a number
    const { currentUser } = useAuth();

    const { register, handleSubmit, formState: { errors } } = useForm();
    const [createOrder, { isLoading }] = useCreateOrderMutation();
    const navigate = useNavigate()

    const [isChecked, setIsChecked] = useState(false);

    const onSubmit = async (data) => {
        const newOrder = {
            name: data.name,
            email: currentUser?.email,
            address: {
                city: data.city,
                country: data.country,
                state: data.state,
                zipcode: data.zipcode,
            },
            phone: data.phone,
            productIds: cartItems.map(item => item?._id),
            totalPrice: totalPrice, 
        };

        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, place the order!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await createOrder(newOrder).unwrap();
                    Swal.fire("Confirmed!", "Your order has been placed successfully!", "success");

                    navigate("/orders")
                } catch (error) {
                    console.error("Error placing order:", error);
                    Swal.fire("Error", "Failed to place the order. Please try again.", "error");
                }
            }
        });
    };

    if (isLoading) return <div>Loading....</div>;

    return (
        <section>
            <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
                <div className="container max-w-screen-lg mx-auto">
                    <h2 className="font-semibold text-xl text-gray-600 mb-2">Cash On Delivery</h2>
                    <p className="text-gray-500 mb-2">Total Price: ${totalPrice.toFixed(2)}</p>
                    <p className="text-gray-500 mb-6">Items: {cartItems.length}</p>

                    <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8 mb-6">
                        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3 my-8">
                            <div className="text-gray-600">
                                <p className="font-medium text-lg">Personal Details</p>
                                <p>Please fill out all the fields.</p>
                            </div>

                            <div className="lg:col-span-2">
                                <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">
                                    {/* Full Name */}
                                    <div className="md:col-span-5">
                                        <label htmlFor="name">Full Name</label>
                                        <input {...register("name", { required: true })} type="text" id="name" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" />
                                        {errors.name && <p className="text-red-500 text-xs mt-1">Name is required.</p>}
                                    </div>

                                    {/* Email */}
                                    <div className="md:col-span-5">
                                        <label htmlFor="email">Email Address</label>
                                        <input type="text" id="email" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" disabled defaultValue={currentUser?.email} />
                                    </div>

                                    {/* Phone Number */}
                                    <div className="md:col-span-5">
                                        <label htmlFor="phone">Phone Number</label>
                                        <input {...register("phone", { required: true })} type="number" id="phone" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" placeholder="+123 456 7890" />
                                        {errors.phone && <p className="text-red-500 text-xs mt-1">Phone number is required.</p>}
                                    </div>

                                    {/* Address */}
                                    <div className="md:col-span-3">
                                        <label htmlFor="address">Address</label>
                                        <input {...register("address", { required: true })} type="text" id="address" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" />
                                        {errors.address && <p className="text-red-500 text-xs mt-1">Address is required.</p>}
                                    </div>

                                    {/* City */}
                                    <div className="md:col-span-2">
                                        <label htmlFor="city">City</label>
                                        <input {...register("city", { required: true })} type="text" id="city" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" />
                                    </div>

                                    {/* Country */}
                                    <div className="md:col-span-2">
                                        <label htmlFor="country">Country</label>
                                        <input {...register("country", { required: true })} type="text" id="country" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" />
                                    </div>

                                    {/* State */}
                                    <div className="md:col-span-2">
                                        <label htmlFor="state">State</label>
                                        <input {...register("state", { required: true })} type="text" id="state" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" />
                                    </div>

                                    {/* Pincode */}
                                    <div className="md:col-span-1">
                                        <label htmlFor="zipcode">zipcode</label>
                                        <input {...register("pincode", { required: true })} type="text" id="pincode" className="h-10 border mt-1 rounded px-4 w-full bg-gray-50" />
                                    </div>

                                    {/* Terms & Conditions */}
                                    <div className="md:col-span-5 mt-3">
                                        <input type="checkbox" id="billing_same" className="form-checkbox" onChange={(e) => setIsChecked(e.target.checked)} />
                                        <label htmlFor="billing_same" className="ml-2">I agree to the <Link className='text-blue-600'>Terms & Conditions</Link> and <Link className='text-blue-600'>Shopping Policy</Link>.</label>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="md:col-span-5 text-right">
                                        <button disabled={!isChecked} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Place Order</button>
                                    </div>

                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CheckoutPage;
