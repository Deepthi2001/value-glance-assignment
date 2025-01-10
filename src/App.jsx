// Import necessary libraries
import { useState, useEffect } from "react";
import axios from "axios";
import { ArrowDown, ArrowUp, FilterIcon } from "lucide-react";

const App = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [revenueRange, setRevenueRange] = useState({ min: "", max: "" });
  const [netIncomeRange, setNetIncomeRange] = useState({ min: "", max: "" });
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [isDateFilterVisible, setIsDateFilterVisible] = useState(false);
  const [isRevenueFilterVisible, setIsRevenueFilterVisible] = useState(false);
  const [isNetIncomeFilterVisible, setIsNetIncomeFilterVisible] =
    useState(false);

  const [sortState, setSortState] = useState({
    date: "asc", // 'asc' for ascending, 'desc' for descending
    revenue: "asc",
    netIncome: "asc",
  });

  const API_KEY = "9KTEaeDjoHXaFq4LyHC8FPKZnplwTSXG";
  const API_URLS = [
    `https://financialmodelingprep.com/api/v3/income-statement/AAPL?period=annual&apikey=${API_KEY}`,
    `https://financialmodelingprep.com/api/v3/income-statement/MSFT?period=annual&apikey=${API_KEY}`,
    `https://financialmodelingprep.com/api/v3/income-statement/TSLA?period=annual&apikey=${API_KEY}`,
  ];

  useEffect(() => {
    const fetchData = async () => {
      const results = await Promise.all(API_URLS.map((url) => axios.get(url)));
      const combinedData = results.flatMap((result) => result.data);
      setData(combinedData);
      setFilteredData(combinedData);
    };
    fetchData();
  }, []);

  const toggleSort = (column) => {
    // Toggle sort direction
    const newDirection = sortState[column] === "asc" ? "desc" : "asc";
    setSortState({ ...sortState, [column]: newDirection });
    handleSort(column, newDirection); // Pass direction to handleSort
  };

  const toggleDateFilterVisibility = () =>
    setIsDateFilterVisible(!isDateFilterVisible);
  const toggleRevenueFilterVisibility = () =>
    setIsRevenueFilterVisible(!isRevenueFilterVisible);
  const toggleNetIncomeFilterVisibility = () =>
    setIsNetIncomeFilterVisible(!isNetIncomeFilterVisible);

  // Apply Filters
  const applyDateFilter = () => {
    console.log("Applying Date Filter:", dateRange);
    setIsDateFilterVisible(false);
    handleFilter();
  };

  const applyRevenueFilter = () => {
    console.log("Applying Revenue Filter:", revenueRange);
    setIsRevenueFilterVisible(false);
    handleFilter();
  };

  const applyNetIncomeFilter = () => {
    console.log("Applying Net Income Filter:", netIncomeRange);
    setIsNetIncomeFilterVisible(false);
    handleFilter();
  };

  const handleFilter = () => {
    let tempData = [...data];

    // Filter by date range
    if (dateRange.start && dateRange.end) {
      tempData = tempData.filter(
        (item) =>
          new Date(item.date) >= new Date(dateRange.start) &&
          new Date(item.date) <= new Date(dateRange.end)
      );
    }

    // Filter by revenue range
    if (revenueRange.min && revenueRange.max) {
      tempData = tempData.filter(
        (item) =>
          item.revenue >= parseFloat(revenueRange.min) &&
          item.revenue <= parseFloat(revenueRange.max)
      );
    }

    // Filter by net income range
    if (netIncomeRange.min && netIncomeRange.max) {
      tempData = tempData.filter(
        (item) =>
          item.netIncome >= parseFloat(netIncomeRange.min) &&
          item.netIncome <= parseFloat(netIncomeRange.max)
      );
    }

    setFilteredData(tempData);
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });

    const sortedData = [...filteredData].sort((a, b) => {
      if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
      if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
      return 0;
    });

    setFilteredData(sortedData);
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Financial Data Filtering App</h1>

      <div className="bg-white shadow rounded-lg">
        <table className="table-auto w-full text-left border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th>
                <div className="relative h-12 px-6 py-3 text-gray-600 font-semibold text-sm border-b cursor-pointer flex justify-between">
                  Date
                  <div className="flex gap-x-2">
                    <div
                      className="w-4 h-4 flex items-center justify-center hover:bg-neutral-100 rounded"
                      onClick={() => toggleSort("date")}
                    >
                      {sortState.date === "asc" ? <ArrowUp /> : <ArrowDown />}
                    </div>
                    <div
                      className="w-4 h-4 flex items-center justify-center rounded"
                      onClick={toggleDateFilterVisibility}
                    >
                      <FilterIcon />
                    </div>
                    {isDateFilterVisible && (
                      <div className="absolute top-3 left-24 z-20 bg-white p-4 shadow rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                          <label className="font-semibold">Date Range:</label>
                          <button
                            onClick={() => setIsDateFilterVisible(false)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="flex gap-x-2">
                          <input
                            type="date"
                            className="block w-full border rounded px-3 py-2"
                            value={dateRange.start}
                            onChange={(e) =>
                              setDateRange({
                                ...dateRange,
                                start: e.target.value,
                              })
                            }
                          />
                          <input
                            type="date"
                            className="block w-full border rounded px-3 py-2"
                            value={dateRange.end}
                            onChange={(e) =>
                              setDateRange({
                                ...dateRange,
                                end: e.target.value,
                              })
                            }
                          />
                        </div>
                        <button
                          onClick={applyDateFilter}
                          className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg"
                        >
                          Apply Filters
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </th>

              <th>
                <div className="relative h-12 px-6 py-3 text-gray-600 font-semibold text-sm border-b cursor-pointer flex justify-between">
                  Revenue
                  <div className="flex gap-x-2">
                    <div
                      className="w-4 h-4 flex items-center justify-center hover:bg-neutral-100 rounded"
                      onClick={() => toggleSort("revenue")}
                    >
                      {sortState.revenue === "asc" ? (
                        <ArrowUp />
                      ) : (
                        <ArrowDown />
                      )}
                    </div>
                    <div
                      className="w-4 h-4 flex items-center justify-center rounded"
                      onClick={toggleRevenueFilterVisibility}
                    >
                      <FilterIcon />
                    </div>
                    {isRevenueFilterVisible && (
                      <div className="absolute top-3 left-0 z-25 bg-white p-4 shadow rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                          <label className="font-semibold">
                            Revenue Range:
                          </label>
                          <button
                            onClick={() => setIsRevenueFilterVisible(false)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="flex gap-x-2">
                          <input
                            type="number"
                            className="block w-full border rounded px-3 py-2"
                            placeholder="Min"
                            value={revenueRange.min}
                            onChange={(e) =>
                              setRevenueRange({
                                ...revenueRange,
                                min: e.target.value,
                              })
                            }
                          />
                          <input
                            type="number"
                            className="block w-full border rounded px-3 py-2"
                            placeholder="Max"
                            value={revenueRange.max}
                            onChange={(e) =>
                              setRevenueRange({
                                ...revenueRange,
                                max: e.target.value,
                              })
                            }
                          />
                        </div>
                        <button
                          onClick={applyRevenueFilter}
                          className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg"
                        >
                          Apply Filters
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </th>

              <th>
                <div className="relative h-12 px-6 py-3 text-gray-600 font-semibold text-sm border-b cursor-pointer flex justify-between">
                  Net Income
                  <div className="flex gap-x-2">
                    <div
                      className="w-4 h-4 flex items-center justify-center hover:bg-neutral-100 rounded"
                      onClick={() => toggleSort("netIncome")}
                    >
                      {sortState.netIncome === "asc" ? (
                        <ArrowUp />
                      ) : (
                        <ArrowDown />
                      )}
                    </div>
                    <div
                      className="w-4 h-4 flex items-center justify-center rounded"
                      onClick={toggleNetIncomeFilterVisibility}
                    >
                      <FilterIcon />
                    </div>
                    {isNetIncomeFilterVisible && (
                      <div className="absolute top-3 left-0 bg-white p-4 shadow rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                          <label className="font-semibold">Income Range:</label>
                          <button
                            onClick={() => setIsNetIncomeFilterVisible(false)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="flex gap-x-2">
                          <input
                            type="number"
                            className="block w-full border rounded px-3 py-2"
                            placeholder="Min"
                            value={netIncomeRange.min}
                            onChange={(e) =>
                              setNetIncomeRange({
                                ...netIncomeRange,
                                min: e.target.value,
                              })
                            }
                          />
                          <input
                            type="number"
                            className="block w-full border rounded px-3 py-2"
                            placeholder="Max"
                            value={netIncomeRange.max}
                            onChange={(e) =>
                              setNetIncomeRange({
                                ...netIncomeRange,
                                max: e.target.value,
                              })
                            }
                          />
                        </div>
                        <button
                          onClick={applyNetIncomeFilter}
                          className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg"
                        >
                          Apply Filters
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </th>
              <th>
                <div className="h-12 px-6 py-3 text-gray-600 font-semibold text-sm border-b">
                  Gross Profit
                </div>
              </th>
              <th>
                <div className="h-12 px-6 py-3 text-gray-600 font-semibold text-sm border-b">
                  EPS
                </div>
              </th>
              <th>
                <div className="h-12 px-6 py-3 text-gray-600 font-semibold text-sm border-b">
                  Operating Income
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.map((item, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="px-6 py-3 text-gray-800 text-sm">{item.date}</td>
                <td className="px-6 py-3 text-gray-800 text-sm">
                  {item.revenue.toLocaleString()}
                </td>
                <td className="px-6 py-3 text-gray-800 text-sm">
                  {item.netIncome.toLocaleString()}
                </td>
                <td className="px-6 py-3 text-gray-800 text-sm">
                  {item.grossProfit.toLocaleString()}
                </td>
                <td className="px-6 py-3 text-gray-800 text-sm">{item.eps}</td>
                <td className="px-6 py-3 text-gray-800 text-sm">
                  {item.operatingIncome.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
