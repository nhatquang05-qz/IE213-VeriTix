import { useState, useEffect, useRef, useCallback } from 'react';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import OrganizerSidebar, { MobileSidebar } from '../components/organizer/OrganizerSidebar';

/* ══════════════════════════════════════════════════════════════════
   Veritix — Tạo Sự Kiện (3-Step Wizard)
   Step 1: Thông tin sự kiện
   Step 2: Cấu hình vé & Lịch trình
   Step 3: Xác nhận & Phát hành
   ══════════════════════════════════════════════════════════════════ */

const API_URL = import.meta.env.VITE_API_URL || '';
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '';

const CREATE_ABI = [
  { inputs: [{ internalType:'string',name:'name',type:'string' },{ internalType:'uint256',name:'price',type:'uint256' },{ internalType:'uint256',name:'maxSupply',type:'uint256' },{ internalType:'uint256',name:'maxResellPercentage',type:'uint256' }], name:'createEvent', outputs:[{ internalType:'uint256',name:'',type:'uint256' }], stateMutability:'nonpayable', type:'function' },
  { anonymous:false, inputs:[{ indexed:true,internalType:'uint256',name:'eventId',type:'uint256' },{ indexed:false,internalType:'string',name:'name',type:'string' },{ indexed:false,internalType:'address',name:'organizer',type:'address' }], name:'EventCreated', type:'event' },
] as const;

const STEPS = [
  { id: 1, label: 'Thông tin sự kiện', icon: '📋' },
  { id: 2, label: 'Cấu hình vé & Lịch trình', icon: '🎫' },
  { id: 3, label: 'Xác nhận & Phát hành', icon: '🚀' },
];

const CATEGORIES = ['Âm nhạc / Concert','Thể thao','Hội nghị / Hội thảo','Triển lãm','Gaming / E-sports','Nghệ thuật','Giáo dục / Workshop','Cộng đồng / Meetup','Khác'];
const CITIES = ['Hà Nội','TP. Hồ Chí Minh','Đà Nẵng','Cần Thơ','Đà Lạt','Nha Trang','Huế','Hải Phòng','Đắk Lắk'];

type FormData = {
  name: string; category: string; locationType: 'offline'|'online'; venueName: string;
  city: string; ward: string; address: string; description: string; orgName: string; orgInfo: string;
  price: string; maxSupply: string; resaleRoyalty: number;
  saleStartDate: string; saleStartTime: string; saleEndDate: string; saleEndTime: string;
  eventStartDate: string; eventStartTime: string; eventEndDate: string; eventEndTime: string;
  earlyBirdPrice: string; earlyBirdQty: string; vipPrice: string; vipQty: string;
};

/* ── SVG Icons ── */
const MenuIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
const CameraIcon = () => <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 2h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0019.07 5H21a2 2 0 012 2v13a2 2 0 01-2 2H3a2 2 0 01-2-2V7z"/><circle cx="12" cy="13" r="3"/></svg>;
const ImageIcon = () => <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="5" width="18" height="14" rx="2"/><path strokeLinecap="round" strokeLinejoin="round" d="M3 15l4-4 4 4 4-5 4 5"/></svg>;
const CalendarIcon = () => <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const ClockIcon = () => <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const CheckIcon = () => <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>;

export default function CreateEventPage() {
  const navigate = useNavigate();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState<FormData>({
    name:'', category:'', locationType:'offline', venueName:'', city:'', ward:'', address:'',
    description:'', orgName:'', orgInfo:'',
    price:'', maxSupply:'', resaleRoyalty: 10,
    saleStartDate:'', saleStartTime:'09:00', saleEndDate:'', saleEndTime:'23:59',
    eventStartDate:'', eventStartTime:'18:00', eventEndDate:'', eventEndTime:'22:00',
    earlyBirdPrice:'', earlyBirdQty:'', vipPrice:'', vipQty:'',
  });

  const [posterFile, setPosterFile] = useState<File|null>(null);
  const [posterPreview, setPosterPreview] = useState('');
  const [bannerFile, setBannerFile] = useState<File|null>(null);
  const [bannerPreview, setBannerPreview] = useState('');
  const [logoFile, setLogoFile] = useState<File|null>(null);
  const [logoPreview, setLogoPreview] = useState('');
  const posterRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);
  const logoRef = useRef<HTMLInputElement>(null);

  const set = useCallback((k: keyof FormData, v: string|number) => {
    setForm(p => ({...p, [k]: v}));
    if (errors[k]) setErrors(p => { const n={...p}; delete n[k]; return n; });
  }, [errors]);

  const filePrev = (f: File|null, setF: (f:File|null)=>void, setP: (s:string)=>void) => {
    setF(f);
    if (f) { const r=new FileReader(); r.onloadend=()=>setP(r.result as string); r.readAsDataURL(f); }
    else setP('');
  };

  /* ── Overrides ── */
  useEffect(() => {
    const b=document.body, r=document.getElementById('root');
    const p={ bg:b.style.backgroundColor, c:b.style.color, mw:r?.style.maxWidth||'', m:r?.style.margin||'', pd:r?.style.padding||'', ta:r?.style.textAlign||'' };
    b.style.backgroundColor='#070a11'; b.style.color='#f1f5f9';
    if(r){ r.style.maxWidth='none'; r.style.margin='0'; r.style.padding='0'; r.style.textAlign='left'; }
    return()=>{ b.style.backgroundColor=p.bg; b.style.color=p.c; if(r){ r.style.maxWidth=p.mw; r.style.margin=p.m; r.style.padding=p.pd; r.style.textAlign=p.ta; } };
  }, []);

  useEffect(() => {
    const ck=()=>{ const w=window.innerWidth; setIsMobile(w<768); if(w<768)setSidebarExpanded(true); if(w>=768&&w<1024)setSidebarExpanded(false); if(w>=1024)setSidebarExpanded(true); };
    ck(); window.addEventListener('resize',ck); return()=>window.removeEventListener('resize',ck);
  }, []);

  /* ── Validation ── */
  const validate = (s: number) => {
    const e: Record<string,string> = {};
    if (s===1) {
      if(!form.name.trim()) e.name='Vui lòng nhập tên sự kiện';
      if(!form.category) e.category='Vui lòng chọn thể loại';
      if(form.locationType==='offline' && !form.venueName.trim()) e.venueName='Vui lòng nhập địa điểm';
      if(!form.description.trim()) e.description='Vui lòng nhập mô tả sự kiện';
    }
    if (s===2) {
      if(!form.price && form.price!=='0') e.price='Vui lòng nhập giá vé';
      if(!form.maxSupply) e.maxSupply='Vui lòng nhập số lượng vé';
      if(!form.saleStartDate) e.saleStartDate='Chọn ngày bắt đầu bán';
      if(!form.saleEndDate) e.saleEndDate='Chọn ngày kết thúc bán';
      if(!form.eventStartDate) e.eventStartDate='Chọn ngày sự kiện';
    }
    setErrors(e);
    if (Object.keys(e).length > 0) toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
    return Object.keys(e).length === 0;
  };

  const next = () => { if(validate(step)) setStep(s=>Math.min(s+1,3)); window.scrollTo({top:0,behavior:'smooth'}); };
  const prev = () => { setStep(s=>Math.max(s-1,1)); window.scrollTo({top:0,behavior:'smooth'}); };

  /* ── Submit ── */
  const handleSubmit = async () => {
    if(!window.ethereum){ toast.error('Vui lòng cài MetaMask!'); return; }
    if(!CONTRACT_ADDRESS){ toast.error('Contract chưa cấu hình .env'); return; }
    try {
      setLoading(true); setStatusMsg('Đang kết nối MetaMask...');
      const provider=new ethers.BrowserProvider(window.ethereum);
      const signer=await provider.getSigner();
      const contract=new ethers.Contract(CONTRACT_ADDRESS,CREATE_ABI,signer);
      setStatusMsg('Vui lòng xác nhận giao dịch trên MetaMask...');
      const tx=await contract.createEvent(form.name, ethers.parseEther(form.price||'0'), Number(form.maxSupply||0), Number(form.resaleRoyalty));
      setStatusMsg('Đang chờ xác nhận từ blockchain...');
      const receipt=await tx.wait();
      let eventId:string|null=null;
      const iface=new ethers.Interface(CREATE_ABI);
      for(const log of receipt.logs){ try{ const p=iface.parseLog({topics:log.topics as string[],data:log.data}); if(p?.name==='EventCreated'){eventId=p.args.eventId.toString();break;} }catch{} }
      toast.success(`On-chain thành công! Event #${eventId||'N/A'}`);
      if(eventId&&(bannerFile||posterFile||form.description)){
        setStatusMsg('Đang upload dữ liệu lên server...');
        const fd=new FormData(); if(bannerFile)fd.append('banner',bannerFile); if(posterFile)fd.append('poster',posterFile); if(logoFile)fd.append('logo',logoFile);
        fd.append('description',form.description); fd.append('category',form.category); fd.append('orgName',form.orgName);
        const tk=localStorage.getItem('token'); const h:Record<string,string>={}; if(tk)h['Authorization']=`Bearer ${tk}`;
        await fetch(`${API_URL}/api/events/${eventId}`,{method:'PUT',headers:h,body:fd});
      }
      toast.success('Tạo sự kiện thành công!');
      setTimeout(()=>navigate('/organizer-dashboard'),1200);
    } catch(err:any) {
      toast.error(err?.reason||err?.message||'Lỗi giao dịch');
      setStatusMsg('');
    } finally { setLoading(false); }
  };

  const sidebarW = isMobile ? 0 : sidebarExpanded ? 220 : 68;

  /* ── Shared Styles ── */
  const S = {
    card: { background:'#0d1117', border:'1px solid rgba(255,255,255,0.06)', borderRadius:16, padding: isMobile?'20px 16px':'28px 32px', transition:'border-color 0.2s' } as React.CSSProperties,
    cardTitle: { fontFamily:"'Inter',sans-serif", fontSize:10, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase' as const, color:'#475569', paddingBottom:14, borderBottom:'1px solid rgba(255,255,255,0.06)', marginBottom:22 },
    label: { display:'flex', alignItems:'center', gap:4, fontSize:13, fontWeight:500, color:'#94a3b8', marginBottom:7 } as React.CSSProperties,
    req: { color:'#f43f5e', fontSize:14, lineHeight:1 } as React.CSSProperties,
    input: (err?:boolean):React.CSSProperties => ({ width:'100%', background:'#080b14', border:`1px solid ${err?'#f43f5e':'rgba(255,255,255,0.1)'}`, borderRadius:10, padding:'12px 16px', fontFamily:"'Inter',sans-serif", fontSize:14, color:'#f1f5f9', outline:'none', transition:'border-color 0.2s, box-shadow 0.2s' }),
    focus: (e:React.FocusEvent<any>)=>{ e.target.style.borderColor='#3b82f6'; e.target.style.boxShadow='0 0 0 3px rgba(59,130,246,0.15)'; },
    blur: (e:React.FocusEvent<any>)=>{ e.target.style.borderColor='rgba(255,255,255,0.1)'; e.target.style.boxShadow='none'; },
  };

  const UploadZone = ({preview, isPortrait, fileRef, label: lbl, size}: {preview:string; isPortrait:boolean; fileRef:React.RefObject<HTMLInputElement|null>; label:string; size:string}) => (
    <div onClick={()=>fileRef.current?.click()} style={{ border:'1.5px dashed rgba(255,255,255,0.1)', borderRadius:14, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', cursor:'pointer', position:'relative', overflow:'hidden', minHeight:isPortrait?220:160, padding:'24px 16px', gap:8, transition:'border-color 0.2s, background 0.2s', background: preview?'transparent':'rgba(59,130,246,0.015)', textAlign:'center' }}
      onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(59,130,246,0.4)';e.currentTarget.style.background='rgba(59,130,246,0.06)';}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.1)';e.currentTarget.style.background=preview?'transparent':'rgba(59,130,246,0.015)';}}
    >
      {preview ? (<>
        <img src={preview} alt="" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',borderRadius:13}}/>
        <div style={{position:'absolute',top:8,right:8,background:'#10b981',color:'#fff',fontSize:10,fontWeight:700,padding:'3px 10px',borderRadius:999,zIndex:2}}>Đã chọn</div>
        <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',opacity:0,transition:'opacity 0.2s',zIndex:1}} className="hz"><span style={{background:'rgba(255,255,255,0.12)',backdropFilter:'blur(8px)',borderRadius:999,padding:'6px 18px',fontSize:12,fontWeight:600,color:'#fff'}}>Thay ảnh</span></div>
      </>) : (<>
        <div style={{width:44,height:44,borderRadius:12,background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.1)',display:'flex',alignItems:'center',justifyContent:'center',color:'#60a5fa'}}>{isPortrait?<CameraIcon/>:<ImageIcon/>}</div>
        <p style={{fontSize:13,fontWeight:500,color:'#94a3b8'}}>{lbl}</p>
        <small style={{fontSize:11,color:'#475569',fontFamily:'monospace'}}>{size}</small>
      </>)}
    </div>
  );

  const DateTimeField = ({dateKey, timeKey, dateLabel}: {dateKey:keyof FormData; timeKey:keyof FormData; dateLabel:string}) => (
    <div>
      <span style={S.label}><span style={S.req}>*</span>{dateLabel}</span>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10}}>
        <div style={{position:'relative'}}>
          <span style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'#475569',pointerEvents:'none',display:'flex'}}><CalendarIcon/></span>
          <input type="date" value={form[dateKey] as string} onChange={e=>set(dateKey,e.target.value)} style={{...S.input(!!errors[dateKey]),paddingLeft:36}} onFocus={S.focus} onBlur={S.blur}/>
        </div>
        <div style={{position:'relative'}}>
          <span style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'#475569',pointerEvents:'none',display:'flex'}}><ClockIcon/></span>
          <input type="time" value={form[timeKey] as string} onChange={e=>set(timeKey,e.target.value)} style={{...S.input(),paddingLeft:36}} onFocus={S.focus} onBlur={S.blur}/>
        </div>
      </div>
      {errors[dateKey] && <p style={{fontSize:11,color:'#f43f5e',marginTop:4}}>{errors[dateKey]}</p>}
    </div>
  );

  return (<>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
      @keyframes vtx-spin{to{transform:rotate(360deg)}}
      @keyframes vtx-fade{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
      @keyframes vtx-pulse{0%,100%{opacity:1}50%{opacity:.4}}
      @keyframes vtx-tooltip-in{from{opacity:0;transform:translateY(-50%) translateX(-6px)}to{opacity:1;transform:translateY(-50%) translateX(0)}}
      .vtx-toggle-btn:hover{color:#38bdf8!important;background:rgba(56,189,248,.15)!important}
      .hz:hover{opacity:1!important}
      input[type="range"]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;background:#3b82f6;border-radius:50%;border:2.5px solid #fff;box-shadow:0 0 10px rgba(59,130,246,.3);cursor:pointer;transition:transform .15s}
      input[type="range"]::-webkit-slider-thumb:hover{transform:scale(1.2)}
      input[type="range"]::-moz-range-thumb{width:18px;height:18px;background:#3b82f6;border-radius:50%;border:2.5px solid #fff;cursor:pointer}
      input[type=date]::-webkit-calendar-picker-indicator,input[type=time]::-webkit-calendar-picker-indicator{filter:invert(1) brightness(0.6)}
      ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#1e293b;border-radius:99px}
      ::placeholder{color:#334155}
    `}</style>
    <ToastContainer position="top-right" autoClose={3500} theme="dark"/>
    <div style={{position:'fixed',inset:0,pointerEvents:'none',zIndex:0,backgroundImage:'linear-gradient(rgba(59,130,246,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.025) 1px, transparent 1px)',backgroundSize:'48px 48px'}}/>

    <div style={{display:'flex',minHeight:'100vh',background:'#070a11',color:'#f1f5f9',fontFamily:"'Inter',sans-serif",position:'relative',zIndex:1}}>
      {!isMobile && <OrganizerSidebar expanded={sidebarExpanded} onToggle={()=>setSidebarExpanded(p=>!p)}/>}
      {isMobile && <MobileSidebar open={mobileMenuOpen} onClose={()=>setMobileMenuOpen(false)}/>}

      <main style={{ flex:1, overflow:'auto', marginLeft:sidebarW, transition:'margin-left 0.3s cubic-bezier(0.4,0,0.2,1)', minWidth:0 }}>
        <div style={{ maxWidth:880, margin:'0 auto', padding:isMobile?'20px 14px 60px':'44px 32px 80px' }}>

          {/* ── Mobile menu ── */}
          {isMobile && <div style={{marginBottom:16}}><button onClick={()=>setMobileMenuOpen(true)} style={{background:'#0d1117',border:'1px solid rgba(255,255,255,0.06)',borderRadius:8,padding:7,color:'#94a3b8',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}><MenuIcon/></button></div>}

          {/* ═══ STEPPER ═══ */}
          <div style={{background:'#0d1117',border:'1px solid rgba(255,255,255,0.06)',borderRadius:14,padding:isMobile?'14px 12px':'16px 28px',marginBottom:isMobile?20:32,display:'flex',alignItems:'center',gap:0,overflowX:'auto'}}>
            {STEPS.map((s,i)=>{
              const done=step>s.id, active=step===s.id;
              return <div key={s.id} style={{display:'contents'}}>
                <div onClick={()=>{if(done)setStep(s.id)}} style={{display:'flex',alignItems:'center',gap:isMobile?6:10,flexShrink:0,cursor:done?'pointer':'default',padding:'4px 0'}}>
                  <div style={{width:32,height:32,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:done?12:13,fontWeight:700,transition:'all 0.3s',background:done?'#10b981':active?'#3b82f6':'rgba(255,255,255,0.05)',color:done||active?'#fff':'#475569',border:active?'2px solid rgba(59,130,246,0.4)':'2px solid transparent',boxShadow:active?'0 0 12px rgba(59,130,246,0.2)':'none'}}>
                    {done ? <CheckIcon/> : s.id}
                  </div>
                  <span style={{fontSize:isMobile?11:13,fontWeight:active?600:400,color:active?'#f1f5f9':done?'#10b981':'#475569',whiteSpace:'nowrap'}}>{isMobile?`Bước ${s.id}`:s.label}</span>
                </div>
                {i<STEPS.length-1 && <div style={{flex:1,height:1,minWidth:isMobile?12:32,margin:'0 10px',background:done?'#10b981':'rgba(255,255,255,0.06)',transition:'background 0.3s'}}/>}
              </div>;
            })}
          </div>

          {/* ── Step title ── */}
          <div style={{marginBottom:isMobile?20:28,animation:'vtx-fade 0.4s ease'}}>
            <h1 style={{fontSize:isMobile?22:28,fontWeight:800,color:'#fff',letterSpacing:'-0.02em'}}>
              {STEPS[step-1].icon} {STEPS[step-1].label}
            </h1>
            <p style={{fontSize:13,color:'#475569',marginTop:6}}>
              {step===1 && 'Nhập thông tin cơ bản về sự kiện của bạn'}
              {step===2 && 'Cấu hình loại vé, giá, số lượng và thời gian bán'}
              {step===3 && 'Kiểm tra lại toàn bộ và phát hành lên blockchain'}
            </p>
          </div>

          {/* ═══ STEP 1: Thông tin sự kiện ═══ */}
          {step===1 && <div style={{display:'flex',flexDirection:'column',gap:14,animation:'vtx-fade 0.4s ease'}}>

            {/* Upload ảnh */}
            <div style={S.card}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
                <span style={S.label}><span style={S.req}>*</span> Upload hình ảnh</span>
                <span style={{fontSize:12,color:'#3b82f6',cursor:'pointer'}}>Xem vị trí hiển thị</span>
              </div>
              <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 2fr',gap:14}}>
                <UploadZone preview={posterPreview} isPortrait fileRef={posterRef} label="Ảnh sự kiện" size="720 × 958"/>
                <UploadZone preview={bannerPreview} isPortrait={false} fileRef={bannerRef} label="Ảnh nền sự kiện" size="1280 × 720"/>
              </div>
              <input ref={posterRef} type="file" accept="image/*" hidden onChange={e=>filePrev(e.target.files?.[0]??null,setPosterFile,setPosterPreview)}/>
              <input ref={bannerRef} type="file" accept="image/*" hidden onChange={e=>filePrev(e.target.files?.[0]??null,setBannerFile,setBannerPreview)}/>
            </div>

            {/* Tên sự kiện */}
            <div style={S.card}>
              <span style={S.label}><span style={S.req}>*</span> Tên sự kiện</span>
              <div style={{position:'relative'}}>
                <input type="text" maxLength={100} value={form.name} onChange={e=>set('name',e.target.value)} placeholder="VD: Blockchain Summit Vietnam 2026" style={{...S.input(!!errors.name),paddingRight:70}} onFocus={S.focus} onBlur={S.blur}/>
                <span style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',fontSize:11,color:'#334155',fontFamily:'monospace'}}>{form.name.length}/100</span>
              </div>
              {errors.name && <p style={{fontSize:11,color:'#f43f5e',marginTop:4}}>{errors.name}</p>}
            </div>

            {/* Thể loại */}
            <div style={S.card}>
              <span style={S.label}><span style={S.req}>*</span> Thể loại sự kiện</span>
              <div style={{position:'relative'}}>
                <select value={form.category} onChange={e=>set('category',e.target.value)} style={{...S.input(!!errors.category),cursor:'pointer',appearance:'none' as any,paddingRight:40}} onFocus={S.focus as any} onBlur={S.blur as any}>
                  <option value="">Vui lòng chọn</option>
                  {CATEGORIES.map(c=><option key={c}>{c}</option>)}
                </select>
                <div style={{position:'absolute',right:14,top:'50%',transform:'translateY(-50%)',width:0,height:0,borderLeft:'5px solid transparent',borderRight:'5px solid transparent',borderTop:'5px solid #475569',pointerEvents:'none'}}/>
              </div>
              {errors.category && <p style={{fontSize:11,color:'#f43f5e',marginTop:4}}>{errors.category}</p>}
            </div>

            {/* Địa chỉ */}
            <div style={S.card}>
              <div style={S.cardTitle}>Địa chỉ sự kiện</div>
              <div style={{display:'flex',gap:8,marginBottom:20}}>
                {(['offline','online'] as const).map(m=>(
                  <button key={m} type="button" onClick={()=>set('locationType',m)} style={{padding:'9px 22px',borderRadius:10,fontSize:13,fontWeight:500,cursor:'pointer',fontFamily:"'Inter',sans-serif",transition:'all 0.18s',border:form.locationType===m?'1px solid #3b82f6':'1px solid rgba(255,255,255,0.1)',background:form.locationType===m?'#3b82f6':'transparent',color:form.locationType===m?'#fff':'#475569'}}>{m==='offline'?'🏢 Offline':'🌐 Online'}</button>
                ))}
              </div>
              {form.locationType==='offline' && <div style={{display:'flex',flexDirection:'column',gap:18}}>
                <div><span style={S.label}><span style={S.req}>*</span> Tên địa điểm</span><input type="text" maxLength={80} value={form.venueName} onChange={e=>set('venueName',e.target.value)} placeholder="Ví dụ: Nhà hát Lớn Hà Nội" style={S.input(!!errors.venueName)} onFocus={S.focus} onBlur={S.blur}/>{errors.venueName&&<p style={{fontSize:11,color:'#f43f5e',marginTop:4}}>{errors.venueName}</p>}</div>
                <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:14}}>
                  <div><span style={S.label}><span style={S.req}>*</span> Tỉnh/Thành</span><select value={form.city} onChange={e=>set('city',e.target.value)} style={{...S.input(),cursor:'pointer',appearance:'none' as any}} onFocus={S.focus as any} onBlur={S.blur as any}><option value="">Chọn tỉnh/thành</option>{CITIES.map(c=><option key={c}>{c}</option>)}</select></div>
                  <div><span style={S.label}>Phường/Xã</span><select disabled={!form.city} style={{...S.input(),cursor:form.city?'pointer':'not-allowed',opacity:form.city?1:0.4,appearance:'none' as any}} onFocus={S.focus as any} onBlur={S.blur as any}><option value="">Phường/Xã</option></select></div>
                </div>
                <div><span style={S.label}><span style={S.req}>*</span> Số nhà, đường</span><input type="text" maxLength={80} value={form.address} onChange={e=>set('address',e.target.value)} placeholder="01 Tràng Tiền, Hoàn Kiếm" style={S.input()} onFocus={S.focus} onBlur={S.blur}/></div>
              </div>}
            </div>

            {/* Mô tả */}
            <div style={S.card}>
              <span style={S.label}><span style={S.req}>*</span> Thông tin sự kiện</span>
              <div style={{border:`1px solid ${errors.description?'#f43f5e':'rgba(255,255,255,0.1)'}`,borderRadius:10,overflow:'hidden',transition:'border-color 0.2s, box-shadow 0.2s'}}
                onFocus={e=>{e.currentTarget.style.borderColor='#3b82f6';e.currentTarget.style.boxShadow='0 0 0 3px rgba(59,130,246,0.15)';}}
                onBlur={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.1)';e.currentTarget.style.boxShadow='none';}}>
                <div style={{display:'flex',flexWrap:'wrap',gap:2,padding:'8px 12px',borderBottom:'1px solid rgba(255,255,255,0.06)',background:'rgba(255,255,255,0.015)'}}>
                  {['B','I','U','—','≡','⊞'].map(b=><button key={b} type="button" style={{width:30,height:30,borderRadius:6,border:'none',background:'transparent',color:'#475569',fontSize:13,fontWeight:b==='B'?700:400,fontStyle:b==='I'?'italic':'normal',textDecoration:b==='U'?'underline':'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>{b}</button>)}
                </div>
                <textarea value={form.description} onChange={e=>set('description',e.target.value)} rows={8} placeholder={`Giới thiệu sự kiện:\n[Tóm tắt ngắn gọn]\n\nChi tiết:\n• Chương trình chính: ...\n• Khách mời: ...\n\nĐiều khoản:\n[TnC sự kiện]`} style={{...S.input(),border:'none',borderRadius:0,minHeight:180,resize:'vertical',lineHeight:1.7}}/>
              </div>
              {errors.description&&<p style={{fontSize:11,color:'#f43f5e',marginTop:4}}>{errors.description}</p>}
            </div>

            {/* Ban tổ chức */}
            <div style={S.card}>
              <div style={S.cardTitle}>Thông tin ban tổ chức</div>
              <div style={{display:'flex',gap:20,alignItems:'flex-start',flexDirection:isMobile?'column':'row'}}>
                <div onClick={()=>logoRef.current?.click()} style={{width:96,height:96,minWidth:96,border:'1.5px dashed rgba(255,255,255,0.1)',borderRadius:16,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',cursor:'pointer',position:'relative',overflow:'hidden',gap:4,transition:'border-color 0.2s'}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(59,130,246,0.4)';}} onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.1)';}}>
                  {logoPreview?<img src={logoPreview} alt="" style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover',borderRadius:14}}/>:<><p style={{fontSize:11,fontWeight:500,color:'#64748b'}}>Logo</p><small style={{fontSize:10,color:'#334155'}}>275×275</small></>}
                  <input ref={logoRef} type="file" accept="image/*" hidden onChange={e=>filePrev(e.target.files?.[0]??null,setLogoFile,setLogoPreview)}/>
                </div>
                <div style={{flex:1,display:'flex',flexDirection:'column',gap:16,width:'100%'}}>
                  <div><span style={S.label}>Tên ban tổ chức</span><input type="text" maxLength={80} value={form.orgName} onChange={e=>set('orgName',e.target.value)} placeholder="Tên ban tổ chức" style={S.input()} onFocus={S.focus} onBlur={S.blur}/></div>
                  <div><span style={S.label}>Thông tin ban tổ chức</span><div style={{position:'relative'}}><textarea maxLength={500} value={form.orgInfo} onChange={e=>set('orgInfo',e.target.value)} rows={3} placeholder="Mô tả ngắn..." style={{...S.input(),resize:'vertical',lineHeight:1.6,paddingBottom:28}} onFocus={S.focus as any} onBlur={S.blur as any}/><span style={{position:'absolute',right:12,bottom:8,fontSize:11,color:'#334155',fontFamily:'monospace'}}>{form.orgInfo.length}/500</span></div></div>
                </div>
              </div>
            </div>
          </div>}

          {/* ═══ STEP 2: Cấu hình vé & Lịch trình ═══ */}
          {step===2 && <div style={{display:'flex',flexDirection:'column',gap:14,animation:'vtx-fade 0.4s ease'}}>

            {/* Loại vé chính */}
            <div style={S.card}>
              <div style={S.cardTitle}>Vé tiêu chuẩn · On-chain</div>
              <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:16}}>
                <div><span style={S.label}><span style={S.req}>*</span> Giá vé (ETH)</span><div style={{position:'relative'}}><span style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',fontSize:15,fontWeight:600,color:'#475569',pointerEvents:'none'}}>Ξ</span><input type="number" step="0.0001" min="0" value={form.price} onChange={e=>set('price',e.target.value)} placeholder="0.05" style={{...S.input(!!errors.price),paddingLeft:32}} onFocus={S.focus} onBlur={S.blur}/></div>{errors.price&&<p style={{fontSize:11,color:'#f43f5e',marginTop:4}}>{errors.price}</p>}</div>
                <div><span style={S.label}><span style={S.req}>*</span> Tổng số vé</span><input type="number" min="1" value={form.maxSupply} onChange={e=>set('maxSupply',e.target.value)} placeholder="1000" style={S.input(!!errors.maxSupply)} onFocus={S.focus} onBlur={S.blur}/>{errors.maxSupply&&<p style={{fontSize:11,color:'#f43f5e',marginTop:4}}>{errors.maxSupply}</p>}</div>
              </div>
              <div style={{marginTop:24}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                  <span style={S.label}>Phí bản quyền bán lại</span>
                  <span style={{fontSize:13,fontWeight:600,color:'#60a5fa'}}>{form.resaleRoyalty}%</span>
                </div>
                <input type="range" min="0" max="30" step="1" value={form.resaleRoyalty} onChange={e=>set('resaleRoyalty',Number(e.target.value))} style={{width:'100%',height:4,borderRadius:99,border:'none',outline:'none',cursor:'pointer',WebkitAppearance:'none',background:`linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(form.resaleRoyalty/30)*100}%, #1e293b ${(form.resaleRoyalty/30)*100}%, #1e293b 100%)`}}/>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'#334155',marginTop:8}}><span>0% — Không thu</span><span>30% — Tối đa</span></div>
              </div>
            </div>

            {/* Vé bổ sung (Early Bird + VIP) */}
            <div style={S.card}>
              <div style={S.cardTitle}>Loại vé bổ sung (Tùy chọn)</div>
              <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:20}}>
                <div style={{background:'rgba(59,130,246,0.04)',borderRadius:12,padding:'18px 16px',border:'1px solid rgba(59,130,246,0.1)'}}>
                  <p style={{fontSize:13,fontWeight:600,color:'#60a5fa',marginBottom:14}}>🎟️ Early Bird</p>
                  <div style={{display:'flex',flexDirection:'column',gap:12}}>
                    <div><span style={{...S.label,fontSize:12}}>Giá (ETH)</span><input type="number" step="0.0001" min="0" value={form.earlyBirdPrice} onChange={e=>set('earlyBirdPrice',e.target.value)} placeholder="0.03" style={{...S.input(),fontSize:13,padding:'9px 14px'}} onFocus={S.focus} onBlur={S.blur}/></div>
                    <div><span style={{...S.label,fontSize:12}}>Số lượng</span><input type="number" min="0" value={form.earlyBirdQty} onChange={e=>set('earlyBirdQty',e.target.value)} placeholder="200" style={{...S.input(),fontSize:13,padding:'9px 14px'}} onFocus={S.focus} onBlur={S.blur}/></div>
                  </div>
                </div>
                <div style={{background:'rgba(168,85,247,0.04)',borderRadius:12,padding:'18px 16px',border:'1px solid rgba(168,85,247,0.1)'}}>
                  <p style={{fontSize:13,fontWeight:600,color:'#a855f7',marginBottom:14}}>👑 VIP</p>
                  <div style={{display:'flex',flexDirection:'column',gap:12}}>
                    <div><span style={{...S.label,fontSize:12}}>Giá (ETH)</span><input type="number" step="0.0001" min="0" value={form.vipPrice} onChange={e=>set('vipPrice',e.target.value)} placeholder="0.1" style={{...S.input(),fontSize:13,padding:'9px 14px'}} onFocus={S.focus} onBlur={S.blur}/></div>
                    <div><span style={{...S.label,fontSize:12}}>Số lượng</span><input type="number" min="0" value={form.vipQty} onChange={e=>set('vipQty',e.target.value)} placeholder="50" style={{...S.input(),fontSize:13,padding:'9px 14px'}} onFocus={S.focus} onBlur={S.blur}/></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lịch trình bán vé */}
            <div style={S.card}>
              <div style={S.cardTitle}>📅 Lịch trình bán vé</div>
              <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:20}}>
                <DateTimeField dateKey="saleStartDate" timeKey="saleStartTime" dateLabel="Bắt đầu bán vé"/>
                <DateTimeField dateKey="saleEndDate" timeKey="saleEndTime" dateLabel="Kết thúc bán vé"/>
              </div>
            </div>

            {/* Lịch trình sự kiện */}
            <div style={S.card}>
              <div style={S.cardTitle}>🗓️ Lịch trình sự kiện</div>
              <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:20}}>
                <DateTimeField dateKey="eventStartDate" timeKey="eventStartTime" dateLabel="Ngày bắt đầu"/>
                <DateTimeField dateKey="eventEndDate" timeKey="eventEndTime" dateLabel="Ngày kết thúc"/>
              </div>
            </div>
          </div>}

          {/* ═══ STEP 3: Xác nhận ═══ */}
          {step===3 && <div style={{display:'flex',flexDirection:'column',gap:14,animation:'vtx-fade 0.4s ease'}}>
            {/* Summary stats */}
            <div style={S.card}>
              <div style={S.cardTitle}>Tóm tắt cấu hình</div>
              <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr 1fr':'repeat(4,1fr)',gap:12,marginBottom:20}}>
                {[
                  {l:'Giá vé',v:form.price?`Ξ ${parseFloat(form.price).toFixed(4)}`:'Miễn phí'},
                  {l:'Số vé',v:form.maxSupply?parseInt(form.maxSupply).toLocaleString():'—'},
                  {l:'Royalty',v:`${form.resaleRoyalty}%`},
                  {l:'Thể loại',v:form.category||'—'},
                ].map(s=>(
                  <div key={s.l} style={{background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:10,padding:'14px 12px',textAlign:'center'}}>
                    <div style={{fontSize:10,textTransform:'uppercase',letterSpacing:'0.1em',color:'#475569',marginBottom:6}}>{s.l}</div>
                    <div style={{fontSize:16,fontWeight:700,color:'#f1f5f9'}}>{s.v}</div>
                  </div>
                ))}
              </div>

              {/* Detail rows */}
              <div style={{display:'flex',flexDirection:'column',gap:0}}>
                {[
                  ['Tên sự kiện',form.name||'—'],
                  ['Địa điểm',form.locationType==='online'?'Online':form.venueName||'—'],
                  ['Bán vé',`${form.saleStartDate||'—'} ${form.saleStartTime} → ${form.saleEndDate||'—'} ${form.saleEndTime}`],
                  ['Sự kiện',`${form.eventStartDate||'—'} ${form.eventStartTime} → ${form.eventEndDate||'—'} ${form.eventEndTime}`],
                  ['Ảnh nền',bannerFile?bannerFile.name:'Chưa upload'],
                  ['Ban tổ chức',form.orgName||'—'],
                ].map(([l,v])=>(
                  <div key={l} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'11px 0',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                    <span style={{fontSize:13,color:'#475569'}}>{l}</span>
                    <span style={{fontSize:13,fontWeight:500,color:'#94a3b8',textAlign:'right',maxWidth:'60%',wordBreak:'break-word'}}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status */}
            {statusMsg && <div style={{display:'flex',alignItems:'center',gap:12,padding:'14px 18px',borderRadius:12,fontSize:13,border:'1px solid rgba(59,130,246,0.2)',background:'rgba(59,130,246,0.06)',color:'#93c5fd'}}>
              {loading?<div style={{width:14,height:14,border:'2px solid currentColor',borderTopColor:'transparent',borderRadius:'50%',animation:'vtx-spin 0.7s linear infinite',flexShrink:0}}/>:<div style={{width:8,height:8,borderRadius:'50%',background:'currentColor',flexShrink:0}}/>}
              <span>{statusMsg}</span>
            </div>}

            {/* Warning */}
            <div style={{background:'rgba(251,191,36,0.04)',border:'1px solid rgba(251,191,36,0.12)',borderRadius:12,padding:'14px 18px'}}>
              <p style={{fontSize:12,color:'#fbbf24',fontWeight:600,marginBottom:4}}>⚠ Lưu ý quan trọng</p>
              <p style={{fontSize:12,color:'#64748b',lineHeight:1.7}}>MetaMask sẽ yêu cầu xác nhận giao dịch. Sau khi blockchain xác nhận, dữ liệu ảnh và mô tả sẽ được đồng bộ lên server. Phí gas phụ thuộc vào mạng Ethereum hiện tại.</p>
            </div>

            {/* Submit */}
            <button type="button" onClick={handleSubmit} disabled={loading} style={{width:'100%',padding:'16px 24px',borderRadius:14,background:loading?'#1e293b':'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',color:loading?'#475569':'#fff',border:'none',fontFamily:"'Inter',sans-serif",fontSize:15,fontWeight:700,letterSpacing:'0.01em',cursor:loading?'not-allowed':'pointer',transition:'all 0.2s',position:'relative',overflow:'hidden',boxShadow:loading?'none':'0 8px 32px rgba(59,130,246,0.2)'}}>
              {loading?'Đang xử lý trên Blockchain...':'🚀 Xác nhận phát hành sự kiện'}
            </button>
            <p style={{textAlign:'center',fontSize:11,color:'#1e293b',marginTop:6,letterSpacing:'0.06em'}}>Giao dịch yêu cầu xác nhận MetaMask · Gas fee theo mạng Ethereum</p>
          </div>}

          {/* ═══ Navigation ═══ */}
          <div style={{display:'flex',justifyContent:step===1?'flex-end':'space-between',alignItems:'center',marginTop:isMobile?20:28,gap:12}}>
            {step>1 && <button type="button" onClick={prev} style={{padding:'12px 28px',borderRadius:10,background:'transparent',border:'1px solid rgba(255,255,255,0.1)',color:'#64748b',fontSize:14,fontWeight:500,cursor:'pointer',fontFamily:"'Inter',sans-serif",transition:'all 0.18s'}} onMouseEnter={e=>{e.currentTarget.style.borderColor='#3b82f6';e.currentTarget.style.color='#f1f5f9';}} onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.1)';e.currentTarget.style.color='#64748b';}}>← Quay lại</button>}
            {step<3 && <button type="button" onClick={next} style={{padding:'12px 32px',borderRadius:10,background:'#3b82f6',border:'none',color:'#fff',fontSize:14,fontWeight:600,cursor:'pointer',fontFamily:"'Inter',sans-serif",transition:'all 0.18s',boxShadow:'0 4px 16px rgba(59,130,246,0.25)'}} onMouseEnter={e=>{e.currentTarget.style.background='#2563eb';}} onMouseLeave={e=>{e.currentTarget.style.background='#3b82f6';}}>Tiếp tục →</button>}
          </div>

          <p style={{textAlign:'center',fontSize:10,letterSpacing:'0.18em',textTransform:'uppercase',color:'#1e293b',marginTop:40}}>Powered by Ethereum · ERC-721 NFT Standard</p>
        </div>
      </main>
    </div>
  </>);
}