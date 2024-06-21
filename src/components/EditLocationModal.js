import React from "react";

export default function EditLocationModal({
  open,
  handleCloseModal,
  newLocationName,
  initialLocationName,
  handleInputChange,
  handleLocationUpdate,
}) {
  return (
    <div>
      {open ? (
        <div className="h-screen w-full bg-black bg-opacity-25 dark:bg-opacity-70 left-0 top-0 fixed z-[500] flex justify-center items-center">
          <div className="-mt-40 sm:w-[500px] bg-white dark:bg-gray-800 rounded-2xl py-3 px-5">
            <div className="flex justify-end mb-3">
              <button
                type="button"
                onClick={handleCloseModal}
                className="text-sm text-black dark:text-white"
              >
                x
              </button>
            </div>
            <form
              onSubmit={handleLocationUpdate}
              className="w-full flex flex-col space-y-5"
            >
              <div>
                <label className="text-black dark:text-white">
                  Location Name
                </label>
                <input
                  onChange={handleInputChange}
                  value={newLocationName}
                  placeholder={initialLocationName}
                  className="border-primary-600 border p-2 my-2 rounded text-black dark:text-white dark:bg-gray-700 w-full"
                />
              </div>
              <button
                type="submit"
                className="bg-primary-600 text-white w-fit font-black p-2 ml-auto rounded-[10px]"
              >
                Update
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
