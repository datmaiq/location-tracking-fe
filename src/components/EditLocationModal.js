export default function EditLocationModal({
                                            open,
                                            handleCloseModal,
                                            newLocationName,
                                            initialLocationName,
                                            handleInputChange,
                                            handleLocationUpdate,
                                          }) {
  return (<div>
      {open ? (<div
          className="h-screen w-full bg-black bg-opacity-25 dark:bg-opacity-70 left-0 top-0 fixed z-[500] flex justify-center  items-center">
          <div className="-mt-40 sm:w-[300px] bg-white dark:bg-dark_green rounded-2xl  py-3 px-5">
            <div className="flex justify-end mb-3">
              <button
                type="button"
                onClick={handleCloseModal}
                className="text-sm"
              >
                x
              </button>
            </div>
            <form
              onSubmit={handleLocationUpdate}
              className="w-full flex flex-col space-y-5"
            >
              <div>
                <label>Location Name</label>
                <input
                  onChange={handleInputChange}
                  value={newLocationName}
                  placeholder={initialLocationName}
                  className="border-border_color border p-2 my-2 rounded text-slate-400 w-full"
                />
              </div>
              <button
                type="submit"
                className="text-black dark:text-white border border-green-500 w-fit font-black p-2 "
              >
                update
              </button>
            </form>
          </div>
        </div>) : null}
    </div>);
}