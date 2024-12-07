import React, { useState } from "react";
import SideCategory from "./SideCategory";
import Search from "./Search";
import { Filter} from "lucide-react";
import { Button } from "../ui/button";



interface LayoutProps {
    children: React.ReactNode;
    items: any[];
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    selectedCategory: string;
    setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
    sortOrder: string;
    setSortOrder: React.Dispatch<React.SetStateAction<string>>;
  }
  
  const Layout: React.FC<LayoutProps> = ({ children,items,searchQuery,setSearchQuery,selectedCategory,setSelectedCategory,sortOrder,setSortOrder }) => {
  const [open, setOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  return (
    <div className="w-full min-h-screen bg-cusgray py-10 md:py-16" style={{ backgroundColor: 'rgba(249, 226, 204, 0.30)' }}>
    
      <Button
        onClick={() => setOpen(!open)}
        className="w-12 h-12 rounded-full fixed z-30 drop-shadow-2xl lg:hidden flex justify-center place-items-center bottom-10 left-0 m-2"
      >
       <Filter/>
      </Button>
      <div className="max-w-6xl mx-auto md:px-0">
        <div className="grid grid-cols-4 gap-x-6">
          <div
            onClick={() => setOpen(!open)}
            className={`${
              open ? `fixed` : `hidden`
            } lg:static lg:inline lg:bg-cusgray h-screen bg-opacity-30 z-20 flex w-full justify-center place-items-center top-0 lg:p-4 bg-orange-100 md:bg-transparent`}
          >
            <SideCategory items={items} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
          </div>
          <div className="col-span-4 md:col-span-4 lg:col-span-3 flex flex-col py-4 mx-2 md:mx-0">
            <div className="rounded-2xl overflow-hidden shadow-lg w-full bg-white mt-6 px-5 py-4">
              <div className="mb-3">
                <div className="flex justify-between place-items-center text-gray-600 text-sm relative gap-2">
                <Search searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
                  <button
                    onClick={() => setSortOpen(!sortOpen)}
                    className="flex place-items-center hover:bg-gray-100 py-1 px-2 rounded-md active:bg-gray-200"
                  >
                    <svg
                      className="w-5 h-5 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
                      />
                    </svg>
                    Sort
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  <div
          className={`${
            sortOpen ? 'absolute' : 'hidden'
          } top-7 shadow-lg rounded-md text-sm right-0 bg-white text-gray-500 z-20 px-2 py-2`}
        >
          <ul>
            <li
              className={`py-1 px-2 rounded-sm hover:bg-gray-100 active:bg-gray-200 ${
                sortOrder === 'lowToHigh' ? 'bg-gray-100 font-semibold text-gray-800' : ''
              }`}
            >
              <button
                className="w-full"
                onClick={() => {
                  setSortOrder('lowToHigh');
                  setSortOpen(false);
                }}
              >
                Price low to high
              </button>
            </li>
            <li
              className={`py-1 px-2 rounded-sm hover:bg-gray-100 active:bg-gray-200 ${
                sortOrder === 'highToLow' ? 'bg-gray-100 font-semibold text-gray-800' : ''
              }`}
            >
              <button
                className="w-full"
                onClick={() => {
                  setSortOrder('highToLow');
                  setSortOpen(false);
                }}
              >
                Price high to low
              </button>
            </li>
          </ul>
        </div>
                </div>
              </div>
              <div
                className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-6`}
              >
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
