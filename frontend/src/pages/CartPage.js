import React, { useContext, useState } from 'react'
import AuthContext from '../context/AuthContext';
import { useParams } from 'react-router-dom'

import { CheckIcon, ClockIcon, QuestionMarkCircleIcon, XMarkIcon as XMarkIconMini } from '@heroicons/react/20/solid'

const CartPage = () => {
  let { user } = useContext(AuthContext)
  let [items, setItems] = useState([])
  let [updated, setUpdated] = useState(false)
  let [total, setTotal] = useState(0)
  let [subTotals, setSubTotals] = useState({})
  let [showModal, setShowModal] = useState(false)

  React.useEffect(() => {
    fetch('http://127.0.0.1:8000/api/get_cart/' + user.user_id)
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setUpdated(false)
        let tot = 0;
        let subTots = {}
        console.log("data:", data)
        for (let i = 0; i < data.length; i++) {
          tot += data[i].price
          if (data[i].license_obj.user_obj.id in subTots) {
            subTots[data[i].license_obj.user_obj.id].tot += data[i].price
            console.log(data[i].license_obj.user_obj, "is in the list")
          }
          else {
            console.log(data[i].license_obj.user_obj, "is not in the list")
            subTots[data[i].license_obj.user_obj.id] = { "tot": data[i].price, "image": data[i].license_obj.user_obj.image, "username": data[i].license_obj.user_obj.username }
          }
        }
        setSubTotals(subTots)
        setTotal(tot)
      })
  }, [updated == true])
  console.log(total)
  console.log("subTotals:", subTotals)



  let removeClick = async (licenseID) => {
    console.log({
      "licenseID": licenseID
    })

    const response = await fetch('http://127.0.0.1:8000/api/update_cart/remove', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      'body': JSON.stringify({
        "userID": user.user_id,
        "licenseID": document.licenseID
      })
    });
    if (!response.ok) {
      //throw new Error(`Error! status: ${response.status}`);
    } else {
      //navigate(`/profile/${user.username}`)
    }

    fetch('http://127.0.0.1:8000/api/update_cart/remove', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      'body': JSON.stringify({
        "userID": user.user_id,
        "licenseID": licenseID
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
        setUpdated(!updated)
      })
  }



  return (
    <section className='bg-zinc-950 min-h-[calc(100vh-56px)]'>
      <main className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-slate-200 sm:text-4xl">Checkout</h1>

        <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <h2 id="cart-heading" className="sr-only">
              Items in your shopping cart
            </h2>

            <ul role="list" className="divide-y divide-gray-200 border-b border-t border-gray-200">
              {items.map((product, productIdx) => (
                <li key={product.id} className="flex py-6 sm:py-10">
                  <div className="flex-shrink-0">
                    <img
                      src={require("../images/music-pics/" + product.song_obj.image.split('/')[product.song_obj.image.split('/').length - 1])}
                      alt={product.song_obj.title}
                      className="h-20 w-20 rounded-md object-cover object-center sm:h-40 sm:w-40"
                    />
                  </div>

                  <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                    <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                      <div>
                        <div className="flex justify-between">
                          <h3 className="text-m">
                            <a href={`/track/${product.songID}`} className="text-m text-slate-200 hover:text-gray-400">
                              {product.song_obj.title}
                            </a>
                          </h3>
                        </div>
                        <div className="text-m">
                          <h3 className="text-sm">
                            <a href={`/profile/${product.license_obj.user_obj.username}`} className="text-m text-blue-700 hover:text-blue-900">
                              {product.license_obj.user_obj.username}
                            </a>
                          </h3>
                        </div>
                        <div className="text-m">
                          <h3 className="text-sm">
                            <p className="text-gray-500">{product.license_obj.name}</p>
                          </h3>
                        </div>
                        <div className="text-m">
                          <h3 className="text-sm">
                            <p className="text-gray-200">${product.price.toFixed(2)}</p>
                          </h3>
                        </div>
                      </div>

                      <div className="mt-4 sm:mt-0 sm:pr-9">
                        <div className="absolute right-0 top-0">
                          <button type="button" onClick={() => removeClick(product.id)} className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500">
                            <span className="sr-only">Remove</span>
                            <XMarkIconMini className="h-5 w-5" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Order summary */}
          <section
            aria-labelledby="summary-heading"
            className="mt-16 border-2 border-indigo-900 rounded-lg bg-indigo-800/50 px-4 py-3 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
          >
            <h2 id="summary-heading" className="text-lg font-medium pb-1 text-slate-200">
              Order summary
            </h2>

            <div className='my-2'>
              <ul>
                {Object.keys(subTotals).map((item, i) => (
                  <li>
                    <div className="flex mb-3">
                      <img
                        src={require("../images/profile-pics/" + subTotals[item].image.split('/')[subTotals[item].image.split('/').length - 1])}
                        alt={subTotals[item].username}
                        className="h-10 w-10 rounded-full self-center object-cover object-center"
                      />
                      <div className="flex items-center p-2 justify-between w-full">
                        <dt className='text-slate-200 font-medium text-sm'>{subTotals[item].username}</dt>
                        <h1 className='text-slate-200 font-medium text-right text-sm'>{`$${subTotals[item].tot.toFixed(2)}`}</h1>
                      </div>

                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <dl className=" space-y-4">
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="text-base font-medium text-slate-200">Order total</dt>
                <dd className="text-base font-medium text-slate-200">${total.toFixed(2)}</dd>
              </div>
            </dl>

            <div className="mt-6">
              <button

                type="submit"
                className="w-full rounded-md bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50">
                Checkout
              </button>
            </div>

          </section>
        </form> 

      </main>
    </section>

  )
}
export default CartPage