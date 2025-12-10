import React, { useState, useEffect } from 'react';
import { 
  Printer, 
  Calculator, 
  Upload, 
  Package, 
  Clock, 
  CheckCircle, 
  Instagram, 
  Mail, 
  Facebook, 
  Menu, 
  X, 
  ChevronRight,
  Cpu,
  Layers,
  Zap
} from 'lucide-react';

// 模擬作品集資料 (已移除光固化項目)
// 【修改說明】：
// 請將您的圖片檔案 (例如: p1.jpg, p2.jpg) 放入專案的 "public" 資料夾中
// 然後修改下方的 image 欄位，格式為 "url('/檔名')"
const portfolioItems = [
  { 
    id: 1, 
    title: "工業級原型", 
    category: "FDM / PLA", 
    // 修改這裡：將原本的漸層色改成您的圖片路徑，例如 url('/project1.jpg')
    image: "url('/project1.jpg')", 
    desc: "高強度機械結構驗證" 
  },
  { 
    id: 3, 
    title: "客製化與禮品", 
    category: "FDM / 雙色絲綢", 
    // 如果還沒有圖片，可以暫時保留 linear-gradient 這種漸層色當作預設圖
    image: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", 
    desc: "獨一無二的漸層色彩" 
  },
  { 
    id: 4, 
    title: "建築沙盤模型", 
    category: "FDM / 白色 PLA", 
    image: "url('/building.jpg')", // 範例：假設您放了一張 building.jpg
    desc: "精確還原建築比例" 
  },
  { 
    id: 5, 
    title: "醫療輔具", 
    category: "TPU / 軟料", 
    image: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)", 
    desc: "具有彈性且親膚的材質" 
  },
  { 
    id: 6, 
    title: "汽機車改裝件", 
    category: "ABS / 耐熱材質", 
    image: "linear-gradient(135deg, #64748b 0%, #94a3b8 100%)", 
    desc: "耐高溫與耐候性測試" 
  },
];

// 報價參數設定 (已移除 Resin 與 噴漆上色)
const PRICING_CONFIG = {
  startupFee: 0, // 開機費/基本費 (NTD)
  hourlyRate: 0,  // 機器每小時運作成本 (NTD)
  materials: {
    pla: { name: "標準 PLA", pricePerGram: 2.5, desc: "最通用，適合一般模型" },
    petg: { name: "耐用 PETG", pricePerGram: 3.0, desc: "耐溫耐候，適合機構件" },
    abs: { name: "工程 ABS", pricePerGram: 3.5, desc: "高強度，可後加工打磨" },
    tpu: { name: "彈性 TPU", pricePerGram: 5.0, desc: "軟料，適合墊片或握把" },
  },
  postProcessing: {
    none: { name: "僅拆支撐", price: 0 },
    sanding: { name: "基本打磨", price: 200 },
  }
};

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // 報價計算器狀態
  const [quoteData, setQuoteData] = useState({
    material: 'pla',
    weight: 50, // 公克
    time: 4,    // 小時
    postProcess: 'none',
    quantity: 1
  });
  
  const [analyzing, setAnalyzing] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(null);
  
  // 聯絡表單的訊息內容 (現在可以用程式控制它了)
  const [contactMessage, setContactMessage] = useState('');

  // 計算價格邏輯
  const calculatePrice = () => {
    const materialCost = quoteData.weight * PRICING_CONFIG.materials[quoteData.material].pricePerGram;
    const timeCost = quoteData.time * PRICING_CONFIG.hourlyRate;
    const postProcessCost = PRICING_CONFIG.postProcessing[quoteData.postProcess].price;
    const subtotal = PRICING_CONFIG.startupFee + materialCost + timeCost + postProcessCost;
    return Math.round(subtotal * quoteData.quantity);
  };

  // 處理「送出訂單需求」按鈕點擊
  const handleSendQuote = () => {
    const price = calculatePrice();
    const summary = `【線上估價需求單】
-------------------------
材質：${PRICING_CONFIG.materials[quoteData.material].name}
預估重量：${quoteData.weight} g
列印時間：${quoteData.time} 小時
後處理：${PRICING_CONFIG.postProcessing[quoteData.postProcess].name}
數量：${quoteData.quantity} 件
-------------------------
系統預估金額：$${price.toLocaleString()} TWD

(備註：請在此描述您的其他需求或上傳檔案連結...)`;
    
    // 1. 設定訊息內容
    setContactMessage(summary);
    // 2. 切換到聯絡頁面
    setActiveSection('contact');
    // 3. 滾動到頂部 (在手機版體驗較好)
    window.scrollTo(0, 0);
  };

  // 模擬檔案上傳與分析
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAnalyzing(true);
      setFileUploaded(file.name);
      setTimeout(() => {
        setQuoteData(prev => ({
          ...prev,
          weight: Math.floor(Math.random() * 150) + 20,
          time: Math.floor(Math.random() * 10) + 2
        }));
        setAnalyzing(false);
      }, 1500);
    }
  };

  const NavItem = ({ section, label }) => (
    <button 
      onClick={() => { setActiveSection(section); setIsMenuOpen(false); }}
      className={`px-4 py-2 rounded-lg transition-colors ${activeSection === section ? 'text-blue-400 font-bold' : 'text-gray-300 hover:text-white'}`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-blue-500 selection:text-white">
      {/* 導覽列 */}
      <nav className="fixed top-0 w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveSection('hero')}>
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Printer size={24} className="text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight">單核工坊 <span className="text-blue-500">Monocore</span></span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex gap-4">
              <NavItem section="hero" label="首頁" />
              <NavItem section="services" label="服務項目" />
              <NavItem section="gallery" label="作品展示" />
              <NavItem section="quote" label="線上報價" />
              <NavItem section="contact" label="聯絡我們" />
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-300 hover:text-white p-2">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-800 border-b border-slate-700">
            <div className="px-2 pt-2 pb-3 space-y-1 flex flex-col">
              <NavItem section="hero" label="首頁" />
              <NavItem section="services" label="服務項目" />
              <NavItem section="gallery" label="作品展示" />
              <NavItem section="quote" label="線上報價" />
              <NavItem section="contact" label="聯絡我們" />
            </div>
          </div>
        )}
      </nav>

      {/* 主內容區 */}
      <main className="pt-16">
        
        {/* 1. Hero Section */}
        {activeSection === 'hero' && (
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 z-0" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
              <div className="text-center max-w-3xl mx-auto">
                <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-medium">
                  單核工坊 Monocore 專業代工
                </div>
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
                  將您的創意 <br/>
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                    完美實體化
                  </span>
                </h1>
                <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
                  我們提供專業的 FDM 熱熔層積列印服務。
                  無論是機械原型驗證、汽機車改裝件，還是客製化禮品，單核工坊都能為您提供快速且穩定的輸出品質。
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => setActiveSection('quote')}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-600/20 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <Calculator size={20} />
                    立即試算價格
                  </button>
                  <button 
                    onClick={() => setActiveSection('gallery')}
                    className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-xl font-bold text-lg border border-slate-700 transition-all flex items-center justify-center gap-2"
                  >
                    瀏覽作品集
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              {/* Feature Grid */}
              <div className="grid md:grid-cols-3 gap-8 mt-24 text-center">
                {[
                  { icon: <Clock size={32} />, title: "高速交件", desc: "使用拓竹 Bambu Lab A1 高速機台，大幅縮短等待時間。" },
                  { icon: <Layers size={32} />, title: "多樣材質", desc: "PLA, ABS, PETG, TPU 等多種工程塑膠任選。" },
                  { icon: <CheckCircle size={32} />, title: "品質保證", desc: "細心調校切片參數，確保模型表面平整與結構強度。" },
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-500/20 text-blue-400 mb-4">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-slate-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. Services Section */}
        {activeSection === 'services' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-3xl font-bold mb-12 text-center">我們的服務流程</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: "01", title: "上傳檔案", desc: "提供 .STL 或 .OBJ 檔案，或提供概念圖讓我們協助建模。", icon: <Upload /> },
                { step: "02", title: "確認報價", desc: "選擇材質與參數，系統自動計算初步報價。", icon: <Calculator /> },
                { step: "03", title: "排程列印", desc: "確認付款後，立即安排機器開始列印。", icon: <Printer /> },
                { step: "04", title: "後處理與出貨", desc: "拆除支撐、基本修整，最後打包寄出。", icon: <Package /> },
              ].map((s, i) => (
                <div key={i} className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
                  <div className="relative bg-slate-800 p-8 rounded-2xl h-full">
                    <div className="text-5xl font-black text-slate-700 absolute top-4 right-4 opacity-50">{s.step}</div>
                    <div className="text-blue-400 mb-4">{s.icon}</div>
                    <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-20 bg-slate-800/50 rounded-3xl p-8 border border-slate-700">
               <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                 <Cpu className="text-blue-400"/> 
                 專業設備介紹
               </h3>
               {/* 調整為單欄置中展示 FDM */}
               <div className="max-w-2xl mx-auto">
                 <div className="bg-slate-800/50 p-8 rounded-xl border border-slate-700/50">
                   <h4 className="text-2xl font-bold text-white mb-4">拓竹 Bambu Lab A1 (FDM)</h4>
                   <p className="text-slate-400 mb-6 text-lg">
                     使用最新一代 Bambu Lab A1 高速列印機。具備全自動流量校準與主動消噪技術，能快速且穩定地輸出高強度結構件，是目前市面上最可靠的 FDM 機型之一。
                   </p>
                   <ul className="space-y-3 text-slate-300">
                     <li className="flex items-center gap-3"><div className="w-2 h-2 bg-blue-400 rounded-full"></div>最大成型尺寸：256 x 256 x 256 mm</li>
                     <li className="flex items-center gap-3"><div className="w-2 h-2 bg-blue-400 rounded-full"></div>層高精度：0.08mm - 0.28mm</li>
                     <li className="flex items-center gap-3"><div className="w-2 h-2 bg-blue-400 rounded-full"></div>特色：AMS 多色支援、高速穩定、結構性強</li>
                   </ul>
                 </div>
               </div>
            </div>
          </div>
        )}

        {/* 3. Gallery Section */}
        {activeSection === 'gallery' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-3xl font-bold mb-4 text-center">作品展示</h2>
            <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
              從工業零件到藝術創作，看看我們如何將虛擬模型帶入現實世界。
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolioItems.map((item) => (
                <div key={item.id} className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-blue-500 transition-colors group">
                  <div 
                    className="h-48 w-full bg-slate-700 flex items-center justify-center relative"
                    style={{ background: item.image }}
                  >
                     {/* Placeholder Icon since we don't have real images */}
                     <Package size={48} className="text-white/20 group-hover:scale-110 transition-transform duration-500" />
                     <div className="absolute bottom-0 left-0 bg-black/50 px-3 py-1 text-xs font-mono text-white backdrop-blur-sm rounded-tr-lg">
                       {item.category}
                     </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                    <p className="text-sm text-slate-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Quote Calculator Section */}
        {activeSection === 'quote' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">線上估價系統</h2>
              <p className="text-slate-400">
                這是一個即時估價參考工具。上傳您的檔案，系統將模擬切片分析。<br/>
                <span className="text-sm text-yellow-500">*實際報價仍以人工審核檔案結構後為準。</span>
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Left: Input & Upload */}
              <div className="space-y-6">
                {/* File Upload Simulation */}
                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Upload size={20} className="text-blue-400" /> 
                    步驟 1: 上傳檔案
                  </h3>
                  <div className="border-2 border-dashed border-slate-600 hover:border-blue-500 rounded-xl p-8 text-center transition-colors cursor-pointer relative">
                    <input 
                      type="file" 
                      accept=".stl,.obj,.step"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {analyzing ? (
                      <div className="flex flex-col items-center text-blue-400">
                        <Zap className="animate-pulse mb-2" size={32} />
                        <span className="animate-pulse">正在分析模型幾何結構...</span>
                      </div>
                    ) : fileUploaded ? (
                      <div className="flex flex-col items-center text-green-400">
                        <CheckCircle className="mb-2" size={32} />
                        <span className="font-bold">{fileUploaded}</span>
                        <span className="text-xs text-slate-500 mt-1">分析完成，請調整下方參數</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-slate-400">
                        <Upload className="mb-2" size={32} />
                        <span>點擊或拖曳 STL 檔案至此</span>
                        <span className="text-xs mt-1 text-slate-500">支援 .STL, .OBJ (最大 50MB)</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Parameters Form (No AI) */}
                <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                   <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Layers size={20} className="text-blue-400" /> 
                    步驟 2: 參數設定
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">選擇材質</label>
                      <select 
                        value={quoteData.material}
                        onChange={(e) => setQuoteData({...quoteData, material: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                      >
                        {Object.entries(PRICING_CONFIG.materials).map(([key, val]) => (
                          <option key={key} value={key}>{val.name} - ${val.pricePerGram}/g</option>
                        ))}
                      </select>
                      <p className="text-xs text-slate-500 mt-1">
                        {PRICING_CONFIG.materials[quoteData.material].desc}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">預估重量 (g)</label>
                        <input 
                          type="number" 
                          value={quoteData.weight}
                          onChange={(e) => setQuoteData({...quoteData, weight: Number(e.target.value)})}
                          className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 outline-none"
                        />
                       </div>
                       <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">列印時間 (hr)</label>
                        <input 
                          type="number" 
                          value={quoteData.time}
                          onChange={(e) => setQuoteData({...quoteData, time: Number(e.target.value)})}
                          className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 outline-none"
                        />
                       </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">後處理加工</label>
                      <select 
                        value={quoteData.postProcess}
                        onChange={(e) => setQuoteData({...quoteData, postProcess: e.target.value})}
                        className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white focus:border-blue-500 outline-none"
                      >
                        {Object.entries(PRICING_CONFIG.postProcessing).map(([key, val]) => (
                          <option key={key} value={key}>{val.name} (+${val.price})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">數量</label>
                      <input 
                        type="range" 
                        min="1" max="50"
                        value={quoteData.quantity}
                        onChange={(e) => setQuoteData({...quoteData, quantity: Number(e.target.value)})}
                        className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                      <div className="text-right text-sm text-blue-400 font-bold">{quoteData.quantity} 件</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Price Breakdown */}
              <div className="space-y-6">
                <div className="bg-gradient-to-b from-slate-800 to-slate-900 p-8 rounded-2xl border border-slate-700 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                  <h3 className="text-xl font-bold mb-6 text-white">預估報價單</h3>
                  
                  <div className="space-y-3 text-sm text-slate-300 mb-8 border-b border-slate-700 pb-6">
                    <div className="flex justify-between">
                      <span>基本開機與檢測費</span>
                      <span>${PRICING_CONFIG.startupFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>耗材費 ({quoteData.weight}g x ${PRICING_CONFIG.materials[quoteData.material].pricePerGram})</span>
                      <span>${(quoteData.weight * PRICING_CONFIG.materials[quoteData.material].pricePerGram).toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>機器工時費 ({quoteData.time}hr x ${PRICING_CONFIG.hourlyRate})</span>
                      <span>${(quoteData.time * PRICING_CONFIG.hourlyRate).toFixed(0)}</span>
                    </div>
                     <div className="flex justify-between">
                      <span>後處理 ({PRICING_CONFIG.postProcessing[quoteData.postProcess].name})</span>
                      <span>${PRICING_CONFIG.postProcessing[quoteData.postProcess].price}</span>
                    </div>
                    {quoteData.quantity > 1 && (
                      <div className="flex justify-between text-blue-400 font-bold">
                        <span>數量加乘 (x{quoteData.quantity})</span>
                        <span></span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-end mb-8">
                    <span className="text-slate-400">總金額 (TWD)</span>
                    <span className="text-4xl font-black text-white tracking-tighter">
                      ${calculatePrice().toLocaleString()}
                    </span>
                  </div>

                  <button 
                    onClick={handleSendQuote}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-blue-600/25 transition-all transform active:scale-95"
                  >
                    送出訂單需求
                  </button>
                  <p className="text-center text-xs text-slate-500 mt-4">
                    此報價僅供參考，點擊送出後我們將由專人與您確認最終檔案與價格。
                  </p>
                </div>

                {/* Contact Info Snippet */}
                <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
                  <h4 className="font-bold mb-2 text-white">需要大量生產或特殊需求？</h4>
                  <p className="text-sm text-slate-400 mb-4">我們提供企業級的批量生產方案以及逆向工程繪圖服務。</p>
                  <button onClick={() => setActiveSection('contact')} className="text-blue-400 text-sm hover:text-blue-300 flex items-center gap-1">
                    聯繫我們討論細節 <ChevronRight size={14}/>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. Contact Section */}
        {activeSection === 'contact' && (
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-3xl font-bold mb-8 text-center">聯絡我們</h2>
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                 <div>
                   <h3 className="text-xl font-bold mb-4 text-white">聯絡資訊</h3>
                   <div className="space-y-4">
                     <div className="flex items-center gap-3 text-slate-300">
                       <Mail className="text-blue-400" />
                       <span>sp020364@gmail.com</span>
                     </div>
                     <div className="flex items-center gap-3 text-slate-300">
                       <Instagram className="text-pink-400" />
                       <span>@monocore_3d</span>
                     </div>
                     <div className="flex items-center gap-3 text-slate-300">
                       <Facebook className="text-blue-600" />
                       <span>Monocore Studio 單核工坊</span>
                     </div>
                   </div>
                 </div>
                 <div className="bg-slate-700/30 p-4 rounded-xl">
                   <h4 className="font-bold text-sm text-slate-300 mb-2">營業時間</h4>
                   <p className="text-slate-400 text-sm">週一至週五: 10:00 - 19:00<br/>週六、日: 休息</p>
                 </div>
              </div>

              <form 
                action="https://formspree.io/f/mqaryevp" 
                method="POST"
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm text-slate-400 mb-1">姓名</label>
                  <input 
                    type="text" 
                    name="name"  
                    required     
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none" 
                    placeholder="您的稱呼" 
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">主旨</label>
                  <select 
                    name="subject" 
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none"
                  >
                    <option>詢問報價</option>
                    <option>代工合作</option>
                    <option>急件處理</option>
                    <option>其他問題</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1 flex justify-between">
                    訊息內容
                  </label>
                  <textarea 
                    name="message" 
                    required       
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 text-white focus:border-blue-500 outline-none h-32" 
                    placeholder="請描述您的需求..." 
                    // 將表單內容與狀態變數連動，這樣自動跳轉時才填得進去
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold transition-colors"
                >
                  發送訊息
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>&copy; 2024 Monocore Studio (單核工坊). All rights reserved.</p>
          <p className="mt-2">致力於提供高品質的積層製造服務。</p>
        </div>
      </footer>
    </div>
  );
}