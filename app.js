const { useState, useEffect, useRef } = React;

// ─── PALETA ──────────────────────────────────────────────────────────────────
const C = {
  bg:"#f1f5f9", card:"#ffffff", border:"#e2e8f0", borderMd:"#cbd5e1",
  text:"#0f172a", textSub:"#64748b", textMuted:"#94a3b8",
  primary:"#6366f1", primaryBg:"#eef2ff",
  green:"#16a34a", greenBg:"#dcfce7",
  red:"#dc2626", redBg:"#fee2e2",
  orange:"#ea580c", orangeBg:"#ffedd5",
  yellow:"#ca8a04", yellowBg:"#fef9c3",
  purple:"#7c3aed", purpleBg:"#ede9fe",
  blue:"#2563eb", blueBg:"#dbeafe",
};

// ─── NÍVEIS ───────────────────────────────────────────────────────────────────
const NIVEIS = [
  { id:0, nome:"Aura Betinha",  emoji:"🤡", cor:"#e11d48", bg:"#fff1f2", stars:0, frase:"precisa focar mais",                    min:0,    max:199   },
  { id:1, nome:"Aura Básica",   emoji:"🛡️", cor:"#b45309", bg:"#fef3c7", stars:1, frase:"sobreviveu à aula",                    min:200,  max:499   },
  { id:2, nome:"Aura Bronze",   emoji:"🥉", cor:"#92400e", bg:"#fde8d8", stars:1, frase:"começando a se engajar",               min:500,  max:999   },
  { id:3, nome:"Aura Rara",     emoji:"💎", cor:"#7c3aed", bg:"#ede9fe", stars:2, frase:"participa às vezes",                   min:1000, max:1799  },
  { id:4, nome:"Aura Épica",    emoji:"🔷", cor:"#0284c7", bg:"#e0f2fe", stars:3, frase:"ajuda colegas",                        min:1800, max:2999  },
  { id:5, nome:"Aura Suprema",  emoji:"👑", cor:"#ca8a04", bg:"#fef9c3", stars:4, frase:"participa e respeita",                 min:3000, max:4499  },
  { id:6, nome:"Aura Lendária", emoji:"🌟", cor:"#0891b2", bg:"#cffafe", stars:5, frase:"referência da turma",                  min:4500, max:6499  },
  { id:7, nome:"Aura Infinita", emoji:"✨", cor:"#16a34a", bg:"#dcfce7", stars:5, frase:"o professor quase chorou de orgulho 😂",min:6500, max:Infinity },
];

const ACOES_PADRAO = [
  { id:"p1",  label:"Participação",      valor:  150, icon:"🙋", cor:C.green,  corBg:C.greenBg,  custom:false },
  { id:"p2",  label:"Colaboração",       valor:  200, icon:"🤝", cor:C.blue,   corBg:C.blueBg,   custom:false },
  { id:"p3",  label:"Respeito",          valor:  150, icon:"💪", cor:C.purple, corBg:C.purpleBg, custom:false },
  { id:"p4",  label:"Organização",       valor:  100, icon:"📋", cor:C.yellow, corBg:C.yellowBg, custom:false },
  { id:"p5",  label:"Produtividade",     valor:  300, icon:"🚀", cor:C.primary,corBg:C.primaryBg,custom:false },
  { id:"p6",  label:"Aula Participada",  valor:  500, icon:"⚡", cor:C.yellow, corBg:C.yellowBg, custom:false },
  { id:"p7",  label:"Tarefa Entregue",   valor:  200, icon:"📝", cor:C.green,  corBg:C.greenBg,  custom:false },
  { id:"p8",  label:"Ajudou Colega",     valor:  250, icon:"🤲", cor:C.blue,   corBg:C.blueBg,   custom:false },
  { id:"p9",  label:"Bagunça / NPC",     valor: -300, icon:"💀", cor:C.red,    corBg:C.redBg,    custom:false },
  { id:"p10", label:"Falta de Respeito", valor: -500, icon:"🔴", cor:C.red,    corBg:C.redBg,    custom:false },
  { id:"p11", label:"Sem Tarefa",        valor: -150, icon:"❌", cor:C.orange, corBg:C.orangeBg, custom:false },
  { id:"p12", label:"Celular na Aula",   valor: -200, icon:"📵", cor:C.orange, corBg:C.orangeBg, custom:false },
];

const EMOJIS = ["🎯","⭐","🔥","💡","🏅","🎮","📚","✏️","🧠","🤖","🎵","🏆","🌟","⚡","🚀","🤝","💪","📋","🙋","❌","💀","🔴","😤","🥳","🎉","🌈","💎","👑","✨","📝","🤲","📵","🏃","🎤","🖥️"];
const CORES  = [{cor:"#16a34a",bg:"#dcfce7"},{cor:"#2563eb",bg:"#dbeafe"},{cor:"#7c3aed",bg:"#ede9fe"},{cor:"#ca8a04",bg:"#fef9c3"},{cor:"#e11d48",bg:"#fff1f2"},{cor:"#ea580c",bg:"#ffedd5"},{cor:"#dc2626",bg:"#fee2e2"},{cor:"#0891b2",bg:"#cffafe"},{cor:"#6366f1",bg:"#eef2ff"},{cor:"#0f766e",bg:"#ccfbf1"}];
const ABAS   = [{id:"ranking",icon:"🏆",label:"Ranking"},{id:"registrar",icon:"⚡",label:"Registrar"},{id:"alunos",icon:"👥",label:"Alunos"},{id:"acoes",icon:"🎯",label:"Ações"},{id:"historico",icon:"📋",label:"Histórico"}];

function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2,6); }
function getNivel(p) {
  if(p < 0) return {id:-1, nome:'Aura Negativa', emoji:'💔', cor:'#dc2626', bg:'#fee2e2', stars:0, frase:'tomou muito castigo...', min:-Infinity, max:-1};
  return NIVEIS.slice().reverse().find(n => p >= n.min) || NIVEIS[0];
}

async function parseArquivo(file) {
  const ext = file.name.split(".").pop().toLowerCase();
  if (ext === "csv" || ext === "txt") {
    const text = await file.text();
    const nomes = [];
    for (const linha of text.split(/\r?\n/).map(l=>l.trim()).filter(Boolean)) {
      const nome = linha.split(/[,;\t]/).map(p=>p.trim()).find(p=>isNaN(Number(p))&&p.length>1);
      if (nome) nomes.push(nome);
    }
    return nomes;
  }
  if (ext === "xlsx" || ext === "xls") {
    const wb = XLSX.read(await file.arrayBuffer(), {type:"array"});
    const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {header:1});
    return rows.map(r=>r.find(c=>typeof c==="string"&&isNaN(Number(c))&&c.trim().length>1)).filter(Boolean).map(n=>n.trim());
  }
  if (ext === "docx") {
    const raw = new TextDecoder("utf-8").decode(new Uint8Array(await file.arrayBuffer()));
    const matches = [...raw.matchAll(/<w:t[^>]*>([^<]+)<\/w:t>/g)].map(m=>m[1].trim()).filter(Boolean);
    return [...new Set(matches.join("\n").split(/\r?\n/).map(l=>l.trim()).filter(l=>l.length>1&&isNaN(Number(l))))];
  }
  return [];
}

// ─── COMPONENTES BASE ─────────────────────────────────────────────────────────
function Stars({count,max=5}) {
  return <span>{Array.from({length:max},(_,i)=><span key={i} style={{color:i<count?"#f59e0b":"#d1d5db",fontSize:13}}>★</span>)}</span>;
}
function ProgressBar({valor,max,cor}) {
  const pct=Math.min(100,Math.max(0,max>0?(valor/max)*100:100));
  return <div style={{background:"#f1f5f9",borderRadius:99,height:7,width:"100%",overflow:"hidden"}}><div style={{width:`${pct}%`,height:"100%",borderRadius:99,background:cor,transition:"width 0.5s cubic-bezier(.4,2,.6,1)"}}/></div>;
}
function Chip({children,cor,bg,size="sm"}) {
  return <span style={{display:"inline-flex",alignItems:"center",background:bg,color:cor,borderRadius:99,padding:size==="lg"?"5px 14px":"2px 9px",fontSize:size==="lg"?13:10,fontWeight:700}}>{children}</span>;
}
function Btn({children,onClick,variant="primary",size="md",style:s={},disabled=false}) {
  const vs={primary:{background:C.primary,color:"#fff",border:"none"},success:{background:C.green,color:"#fff",border:"none"},danger:{background:"#fff",color:C.red,border:`1.5px solid ${C.red}`},ghost:{background:"#f1f5f9",color:C.text,border:"none"},outline:{background:"#fff",color:C.textSub,border:`1.5px solid ${C.border}`}};
  const sz={sm:"5px 12px",md:"9px 18px",lg:"12px 28px"};
  return <button onClick={onClick} disabled={disabled} style={{...vs[variant],padding:sz[size],borderRadius:10,fontWeight:700,fontSize:13,cursor:disabled?"not-allowed":"pointer",opacity:disabled?0.6:1,transition:"opacity 0.15s",...s}} onMouseEnter={e=>!disabled&&(e.currentTarget.style.opacity="0.82")} onMouseLeave={e=>e.currentTarget.style.opacity=disabled?"0.6":"1"}>{children}</button>;
}
function Card({children,style:s={}}) {
  return <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:18,...s}}>{children}</div>;
}
function Modal({onClose,children,title,maxWidth=440}) {
  return <div style={{position:"fixed",inset:0,background:"#00000055",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={onClose}><div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:20,padding:24,width:"100%",maxWidth,maxHeight:"90vh",overflowY:"auto",boxShadow:"0 24px 60px #0003"}} onClick={e=>e.stopPropagation()}>{title&&<div style={{fontWeight:800,fontSize:18,color:C.text,marginBottom:18}}>{title}</div>}{children}</div></div>;
}
function Toast({toast}) {
  if(!toast) return null;
  const map={success:[C.green,C.greenBg],error:[C.red,C.redBg],info:[C.primary,C.primaryBg]};
  const [cor,bg]=map[toast.tipo]||map.info;
  return <div style={{position:"fixed",top:18,left:"50%",transform:"translateX(-50%)",background:bg,border:`1.5px solid ${cor}`,color:cor,padding:"10px 22px",borderRadius:99,fontWeight:700,fontSize:13,zIndex:9999,boxShadow:"0 4px 20px #0001",whiteSpace:"nowrap",maxWidth:"90vw",overflow:"hidden",textOverflow:"ellipsis",animation:"toastIn 0.2s ease"}}>{toast.msg}</div>;
}
function Label({children,style:s={}}) {
  return <div style={{fontSize:11,fontWeight:700,color:C.textSub,letterSpacing:0.8,textTransform:"uppercase",marginBottom:7,...s}}>{children}</div>;
}
function Input({value,onChange,placeholder,onKeyDown,type="text",style:s={}}) {
  return <input type={type} value={value} onChange={onChange} onKeyDown={onKeyDown} placeholder={placeholder}
    style={{width:"100%",background:"#f8f9fb",border:`1.5px solid ${C.border}`,borderRadius:10,padding:"10px 14px",color:C.text,fontSize:14,outline:"none",...s}}
    onFocus={e=>e.target.style.borderColor=C.primary} onBlur={e=>e.target.style.borderColor=C.border}/>;
}
function Spinner() {
  return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",flexDirection:"column",gap:16}}>
    <div className="spin" style={{fontSize:44}}>👑</div>
    <div style={{color:C.textSub,fontSize:14}}>Carregando Projeto Aura...</div>
  </div>;
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function TelaLogin() {
  const [tela,setTela]=useState("login");
  const [nome,setNome]=useState("");
  const [email,setEmail]=useState("");
  const [senha,setSenha]=useState("");
  const [senha2,setSenha2]=useState("");
  const [erro,setErro]=useState("");
  const [sucesso,setSucesso]=useState("");
  const [showPw,setShowPw]=useState(false);
  const [loading,setLoading]=useState(false);
  function ir(t){setErro("");setSucesso("");setTela(t);}

  async function handleLogin(){
    setErro("");setLoading(true);
    try{ await auth.signInWithEmailAndPassword(email.trim(),senha); }
    catch(e){
      const m={"auth/user-not-found":"E-mail não cadastrado.","auth/wrong-password":"Senha incorreta.","auth/invalid-credential":"E-mail ou senha incorretos.","auth/invalid-email":"E-mail inválido."};
      setErro(m[e.code]||"Erro ao entrar.");
    }
    setLoading(false);
  }
  async function handleCadastro(){
    setErro("");
    if(!nome.trim()||!email||!senha||!senha2){setErro("Preencha todos os campos.");return;}
    if(senha.length<6){setErro("Senha com ao menos 6 caracteres.");return;}
    if(senha!==senha2){setErro("As senhas não coincidem.");return;}
    setLoading(true);
    try{
      const c=await auth.createUserWithEmailAndPassword(email.trim(),senha);
      await c.user.updateProfile({displayName:nome.trim()});
      await db.collection("usuarios").doc(c.user.uid).set({nome:nome.trim(),email:email.trim(),criadoEm:firebase.firestore.FieldValue.serverTimestamp()});
    }catch(e){
      const m={"auth/email-already-in-use":"E-mail já cadastrado.","auth/invalid-email":"E-mail inválido.","auth/weak-password":"Senha muito fraca."};
      setErro(m[e.code]||"Erro ao criar conta.");
    }
    setLoading(false);
  }
  async function handleGoogle(){
    setErro("");setLoading(true);
    try{
      const c=await auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
      await db.collection("usuarios").doc(c.user.uid).set({nome:c.user.displayName||"Professor",email:c.user.email,criadoEm:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});
    }catch(e){setErro("Erro ao entrar com Google.");}
    setLoading(false);
  }
  async function handleRecuperar(){
    setErro("");setLoading(true);
    try{await auth.sendPasswordResetEmail(email.trim());setSucesso("E-mail de recuperação enviado!");}
    catch(e){setErro("E-mail não encontrado.");}
    setLoading(false);
  }

  return(
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#eef2ff 0%,#f0fdf4 100%)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
      <div style={{width:"100%",maxWidth:420}}>
        <div style={{textAlign:"center",marginBottom:36}}>
          <div style={{fontSize:60,marginBottom:10}}>👑</div>
          <div style={{fontSize:30,fontWeight:900,color:C.text}}>Projeto Aura</div>
          <div style={{fontSize:14,color:C.textSub,marginTop:6}}>Sistema de Gamificação Escolar</div>
        </div>
        <div style={{background:C.card,borderRadius:22,padding:30,boxShadow:"0 10px 50px #6366f118",border:`1px solid ${C.border}`}}>
          {tela!=="recuperar"&&(
            <div style={{display:"flex",background:"#f1f5f9",borderRadius:12,padding:4,marginBottom:26}}>
              {[["login","Entrar"],["cadastro","Criar conta"]].map(([k,l])=>(
                <button key={k} onClick={()=>ir(k)} style={{flex:1,padding:"9px",background:tela===k?C.card:"transparent",border:"none",borderRadius:9,fontWeight:700,fontSize:14,color:tela===k?C.primary:C.textSub,cursor:"pointer",transition:"all 0.2s"}}>{l}</button>
              ))}
            </div>
          )}
          {tela==="recuperar"&&<div style={{marginBottom:22}}><div style={{fontWeight:800,fontSize:18}}>Recuperar senha</div><div style={{fontSize:13,color:C.textSub,marginTop:4}}>Informe seu e-mail.</div></div>}
          {erro&&<div style={{background:C.redBg,border:`1px solid ${C.red}30`,color:C.red,borderRadius:10,padding:"10px 14px",fontSize:13,fontWeight:600,marginBottom:16}}>⚠️ {erro}</div>}
          {sucesso&&<div style={{background:C.greenBg,border:`1px solid ${C.green}30`,color:C.green,borderRadius:10,padding:"10px 14px",fontSize:13,fontWeight:600,marginBottom:16}}>✅ {sucesso}</div>}
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            {tela==="cadastro"&&<div><Label>Nome completo</Label><Input value={nome} onChange={e=>setNome(e.target.value)} placeholder="Seu nome"/></div>}
            <div><Label>E-mail</Label><Input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="professor@escola.com.br" onKeyDown={e=>e.key==="Enter"&&tela==="login"&&handleLogin()}/></div>
            {tela!=="recuperar"&&<div><Label>Senha</Label><div style={{position:"relative"}}><Input type={showPw?"text":"password"} value={senha} onChange={e=>setSenha(e.target.value)} placeholder={tela==="cadastro"?"Mínimo 6 caracteres":"Sua senha"} onKeyDown={e=>e.key==="Enter"&&tela==="login"&&handleLogin()} style={{paddingRight:44}}/><button onClick={()=>setShowPw(p=>!p)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"transparent",border:"none",cursor:"pointer",fontSize:18,color:C.textMuted}}>{showPw?"🙈":"👁️"}</button></div></div>}
            {tela==="cadastro"&&<div><Label>Confirmar senha</Label><Input type={showPw?"text":"password"} value={senha2} onChange={e=>setSenha2(e.target.value)} placeholder="Repita a senha" onKeyDown={e=>e.key==="Enter"&&handleCadastro()}/></div>}
          </div>
          {tela==="login"&&<div style={{textAlign:"right",marginTop:10}}><button onClick={()=>ir("recuperar")} style={{background:"transparent",border:"none",color:C.primary,fontSize:12,cursor:"pointer",fontWeight:600}}>Esqueceu a senha?</button></div>}
          <button onClick={tela==="login"?handleLogin:tela==="cadastro"?handleCadastro:handleRecuperar} disabled={loading}
            style={{width:"100%",marginTop:22,background:loading?"#a5b4fc":C.primary,border:"none",borderRadius:12,padding:"14px",color:"#fff",fontWeight:800,fontSize:15,cursor:loading?"not-allowed":"pointer"}}>
            {loading?"⏳ Aguarde...":tela==="login"?"Entrar →":tela==="cadastro"?"Criar conta":"Enviar instruções"}
          </button>
          {tela!=="recuperar"&&(<>
            <div style={{display:"flex",alignItems:"center",gap:10,margin:"20px 0 16px"}}><div style={{flex:1,height:1,background:C.border}}/><span style={{color:C.textMuted,fontSize:12}}>ou</span><div style={{flex:1,height:1,background:C.border}}/></div>
            <button onClick={handleGoogle} disabled={loading} style={{width:"100%",background:"#fff",border:`1.5px solid ${C.border}`,borderRadius:12,padding:"12px",color:C.text,fontWeight:700,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10}} onMouseEnter={e=>e.currentTarget.style.background="#f8f9fb"} onMouseLeave={e=>e.currentTarget.style.background="#fff"}>
              <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#4285F4" d="M44.5 20H24v8.5h11.7C34.2 33.6 29.6 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6-6C34.5 5.1 29.5 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.9 0 20-7.9 20-21 0-1.3-.2-2.7-.5-4z"/><path fill="#34A853" d="M6.3 14.7l7 5.1C15 16.1 19.2 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6-6C34.5 5.1 29.5 3 24 3 16.2 3 9.5 7.9 6.3 14.7z"/><path fill="#FBBC05" d="M24 45c5.4 0 10.3-1.8 14.1-4.9l-6.5-5.3C29.5 36.5 26.9 37 24 37c-5.6 0-10.2-3.4-11.7-8.1l-7 5.4C8.8 41.1 15.8 45 24 45z"/><path fill="#EA4335" d="M44.5 20H24v8.5h11.7c-.9 2.6-2.6 4.8-4.8 6.3l6.5 5.3C41.4 37 45 31 45 24c0-1.3-.2-2.7-.5-4z"/></svg>
              Entrar com Google
            </button>
          </>)}
          {tela==="recuperar"&&!sucesso&&<button onClick={()=>ir("login")} style={{width:"100%",marginTop:12,background:"transparent",border:"none",color:C.textSub,fontSize:13,cursor:"pointer",fontWeight:600}}>← Voltar</button>}
        </div>
        <div style={{textAlign:"center",marginTop:18,fontSize:11,color:C.textMuted}}>🔒 Dados salvos com segurança no Firebase</div>
      </div>
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
function App() {
  const [usuario,setUsuario]=useState(undefined);
  const [turmas,setTurmas]=useState([]);
  const [turmaId,setTurmaId]=useState(null);
  const [aba,setAba]=useState("ranking");
  const [selId,setSelId]=useState(null);
  const [toast,setToast]=useState(null);
  const [modal,setModal]=useState(null);
  const [mData,setMData]=useState({});
  const [novoNome,setNovoNome]=useState("");
  const [editNomeTurma,setEditNomeTurma]=useState(false);
  const [nomeEdit,setNomeEdit]=useState("");
  const [formAcao,setFormAcao]=useState({label:"",valor:"",icon:"🎯",cor:C.green,corBg:C.greenBg,tipo:"positivo"});
  const [importNomes,setImportNomes]=useState([]);
  const [importDrag,setImportDrag]=useState(false);
  const [importLoading,setImportLoading]=useState(false);
  const [modoMassa,setModoMassa]=useState(false);
  const [acaoMassa,setAcaoMassa]=useState(null);
  const [alunosMassa,setAlunosMassa]=useState(new Set());
  const fileRef=useRef();
  const toastRef=useRef();

  useEffect(()=>{
    return auth.onAuthStateChanged(async u=>{
      if(u){
        const doc=await db.collection("usuarios").doc(u.uid).get();
        setUsuario({uid:u.uid,nome:u.displayName||doc.data()?.nome||"Professor",email:u.email});
      }else setUsuario(null);
    });
  },[]);

  useEffect(()=>{
    if(!usuario?.uid) return;
    return db.collection("usuarios").doc(usuario.uid).collection("turmas").orderBy("criadaEm","asc").onSnapshot(snap=>{
      const lista=snap.docs.map(d=>({id:d.id,...d.data(),acoes:d.data().acoes||ACOES_PADRAO}));
      setTurmas(lista);
      if(lista.length&&!turmaId) setTurmaId(lista[0].id);
    });
  },[usuario?.uid]);

  function showToast(msg,tipo="info"){clearTimeout(toastRef.current);setToast({msg,tipo});toastRef.current=setTimeout(()=>setToast(null),2800);}

  const turmaAtual=turmas.find(t=>t.id===turmaId)||turmas[0];
  const alunos=turmaAtual?.alunos||[];
  const historico=turmaAtual?.historico||[];
  const acoes=turmaAtual?.acoes||[];
  const ranking=[...alunos].sort((a,b)=>b.pontos-a.pontos);
  const alunoSel=alunos.find(a=>a.id===selId);
  const nivelSel=alunoSel?getNivel(alunoSel.pontos):null;
  const proxNivel=nivelSel?NIVEIS[Math.min(NIVEIS.length-1,nivelSel.id+1)]:null;
  const histAluno=historico.filter(h=>h.alunoId===selId);

  function turmaRef(id){return db.collection("usuarios").doc(usuario.uid).collection("turmas").doc(id||turmaAtual?.id);}

  async function criarTurma(nome){
    const doc=await db.collection("usuarios").doc(usuario.uid).collection("turmas").add({nome:nome.trim(),alunos:[],historico:[],acoes:ACOES_PADRAO,criadaEm:firebase.firestore.FieldValue.serverTimestamp()});
    setTurmaId(doc.id);setSelId(null);setAba("ranking");showToast(`Turma "${nome.trim()}" criada!`,"success");
  }
  async function deletarTurma(id){
    if(turmas.length===1){showToast("Precisa ter ao menos 1 turma!","error");return;}
    await turmaRef(id).delete();
    const r=turmas.filter(t=>t.id!==id);setTurmaId(r[0]?.id||null);setSelId(null);showToast("Turma removida.","info");
  }
  async function renomearTurma(id,nome){if(nome?.trim()) await turmaRef(id).update({nome:nome.trim()});}
  async function adicionarAluno(nomeParam){
    const n=(nomeParam||novoNome).trim();
    if(!n||alunos.find(a=>a.nome.toLowerCase()===n.toLowerCase())) return false;
    await turmaRef().update({alunos:[...alunos,{id:uid(),nome:n,pontos:0}]});
    return true;
  }
  async function adicionarAlunoInput(){
    if(!await adicionarAluno()){showToast("Aluno já existe ou nome vazio!","error");return;}
    showToast(`${novoNome.trim()} adicionado!`,"success");setNovoNome("");
  }
  async function removerAluno(alunoId){
    await turmaRef().update({alunos:alunos.filter(a=>a.id!==alunoId),historico:historico.filter(h=>h.alunoId!==alunoId)});
    if(selId===alunoId)setSelId(null);showToast("Aluno removido.","info");
  }
  async function editarPontos(alunoId,pts){
    await turmaRef().update({alunos:alunos.map(a=>a.id===alunoId?{...a,pontos:pts}:a)});
    showToast("Pontos atualizados!","success");
  }
  async function processarArquivo(file){
    setImportLoading(true);
    try{
      const nomes=[...new Set(await parseArquivo(file))].filter(n=>n.length>1);
      if(!nomes.length){showToast("Nenhum nome encontrado.","error");setImportLoading(false);return;}
      setImportNomes(nomes);setMData({fileName:file.name});setModal("import");
    }catch(e){showToast("Erro ao ler arquivo.","error");}
    setImportLoading(false);
  }
  async function confirmarImport(selecionados){
    const existentes=new Set(alunos.map(a=>a.nome.toLowerCase()));
    const novos=selecionados.filter(n=>!existentes.has(n.toLowerCase())).map(n=>({id:uid(),nome:n.trim(),pontos:0}));
    if(!novos.length){showToast("Nenhum aluno novo.","error");return;}
    await turmaRef().update({alunos:[...alunos,...novos]});
    showToast(`${novos.length} aluno(s) importado(s)!`,"success");setModal(null);setImportNomes([]);
  }
  async function aplicarAcao(alunoId,acao){
    const novosAlunos=alunos.map(a=>{
      if(a.id!==alunoId)return a;
      const antes=getNivel(a.pontos);const novos=a.pontos+acao.valor;const depois=getNivel(novos);
      if(depois.id>antes.id)setTimeout(()=>showToast(`LEVEL UP! ${a.nome} → ${depois.nome} ${depois.emoji}`,"success"),0);
      else if(depois.id<antes.id)setTimeout(()=>showToast(`${a.nome} perdeu nível → ${depois.nome}`,"error"),0);
      else setTimeout(()=>showToast(`${acao.icon} ${a.nome}: ${acao.valor>0?"+":""}${acao.valor} AURA`,"info"),0);
      return{...a,pontos:novos};
    });
    const aluno=alunos.find(a=>a.id===alunoId);
    const novoHist=[{id:uid(),alunoId,alunoNome:aluno?.nome,acao:acao.label,valor:acao.valor,icon:acao.icon,data:new Date().toLocaleString("pt-BR")},...historico].slice(0,200);
    await turmaRef().update({alunos:novosAlunos,historico:novoHist});
  }
  async function aplicarAcaoMassa(acao, ids){
    if(!ids.size){showToast("Selecione ao menos um aluno!","error");return;}
    const data = new Date().toLocaleString("pt-BR");
    const novosRegistros = [];
    const novosAlunos = alunos.map(a=>{
      if(!ids.has(a.id)) return a;
      const antes=getNivel(a.pontos);
      const novos=a.pontos+acao.valor;
      const depois=getNivel(novos);
      novosRegistros.push({id:uid(),alunoId:a.id,alunoNome:a.nome,acao:acao.label,valor:acao.valor,icon:acao.icon,data});
      return {...a,pontos:novos};
    });
    const novoHist=[...novosRegistros,...historico].slice(0,200);
    await turmaRef().update({alunos:novosAlunos,historico:novoHist});
    showToast(`${acao.icon} ${acao.label} aplicado para ${ids.size} aluno(s)!`,"success");
    setAlunosMassa(new Set());
    setAcaoMassa(null);
    setModoMassa(false);
  }
  async function salvarAcao(editId){
    const valor=parseInt(formAcao.valor,10);
    if(!formAcao.label.trim()||isNaN(valor)||valor===0){showToast("Preencha nome e valor!","error");return;}
    const fv=formAcao.tipo==="negativo"?-Math.abs(valor):Math.abs(valor);
    const novasAcoes=editId?acoes.map(a=>a.id===editId?{...a,label:formAcao.label.trim(),valor:fv,icon:formAcao.icon,cor:formAcao.cor,corBg:formAcao.corBg}:a):[...acoes,{id:uid(),label:formAcao.label.trim(),valor:fv,icon:formAcao.icon,cor:formAcao.cor,corBg:formAcao.corBg,custom:true}];
    await turmaRef().update({acoes:novasAcoes});
    showToast(editId?"Ação atualizada!":"Ação criada!","success");setModal(null);
  }
  async function deletarAcao(id){await turmaRef().update({acoes:acoes.filter(a=>a.id!==id)});showToast("Ação removida.","info");setModal(null);}
  async function editarHistorico(registroId, novoValor, novaAcao){
    const novoHist = historico.map(h => h.id===registroId ? {...h, acao:novaAcao, valor:novoValor, editado:true} : h);
    // recalcula pontos dos alunos baseado no historico corrigido
    const totais = {};
    novoHist.forEach(h => { totais[h.alunoId] = (totais[h.alunoId]||0) + h.valor; });
    const novosAlunos = alunos.map(a => ({...a, pontos: totais[a.id]||0}));
    await turmaRef().update({historico:novoHist, alunos:novosAlunos});
    showToast("Histórico atualizado!","success");
  }
  async function apagarHistorico(registroId){
    const reg = historico.find(h=>h.id===registroId);
    const novoHist = historico.filter(h=>h.id!==registroId);
    // recalcula pontos
    const totais = {};
    novoHist.forEach(h => { totais[h.alunoId] = (totais[h.alunoId]||0) + h.valor; });
    const novosAlunos = alunos.map(a => ({...a, pontos: totais[a.id]||0}));
    await turmaRef().update({historico:novoHist, alunos:novosAlunos});
    showToast("Registro removido e pontos recalculados!","info");
  }
  function abrirNovaAcao(){setFormAcao({label:"",valor:"",icon:"🎯",cor:C.green,corBg:C.greenBg,tipo:"positivo"});setMData({});setModal("acao");}
  function abrirEditAcao(a){setFormAcao({label:a.label,valor:String(Math.abs(a.valor)),icon:a.icon,cor:a.cor,corBg:a.corBg||C.primaryBg,tipo:a.valor<0?"negativo":"positivo"});setMData({editId:a.id,custom:a.custom});setModal("acao");}

  if(usuario===undefined)return <Spinner/>;
  if(!usuario)return <TelaLogin/>;

  const NavItem=({item})=>(
    <button onClick={()=>setAba(item.id)} style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"10px 16px",background:aba===item.id?C.primaryBg:"transparent",border:"none",borderRadius:10,color:aba===item.id?C.primary:C.textSub,fontWeight:aba===item.id?700:500,fontSize:14,cursor:"pointer",transition:"all 0.15s",textAlign:"left",marginBottom:2}}>
      <span style={{fontSize:18}}>{item.icon}</span>{item.label}
    </button>
  );

  return(
    <div className="app-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div style={{padding:"20px 16px 12px"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
            <div style={{fontSize:28}}>👑</div>
            <div><div style={{fontWeight:900,fontSize:15,color:C.text}}>Projeto Aura</div><div style={{fontSize:10,color:C.textMuted}}>Gamificação Escolar</div></div>
          </div>
          <div style={{marginBottom:16}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
              <Label style={{marginBottom:0}}>Turmas</Label>
              <button onClick={()=>{setMData({});setModal("novaTurma");}} style={{background:C.primaryBg,border:"none",borderRadius:6,color:C.primary,fontWeight:800,fontSize:18,cursor:"pointer",width:26,height:26,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
            </div>
            {turmas.map(t=>(
              <button key={t.id} onClick={()=>{setTurmaId(t.id);setSelId(null);setAba("ranking");}}
                style={{display:"block",width:"100%",padding:"7px 12px",background:t.id===turmaId?C.primary:"#f1f5f9",border:"none",borderRadius:9,color:t.id===turmaId?"#fff":C.textSub,fontWeight:t.id===turmaId?700:500,fontSize:13,cursor:"pointer",textAlign:"left",marginBottom:4,transition:"all 0.15s"}}>
                {t.nome}
              </button>
            ))}
          </div>
          <div style={{height:1,background:C.border,marginBottom:12}}/>
          {ABAS.map(item=><NavItem key={item.id} item={item}/>)}
        </div>
        <div style={{marginTop:"auto",padding:"14px 16px",borderTop:`1px solid ${C.border}`}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:36,height:36,borderRadius:50,background:C.primaryBg,border:`2px solid ${C.primary}`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:16,color:C.primary,flexShrink:0}}>{usuario.nome.charAt(0).toUpperCase()}</div>
            <div style={{flex:1,minWidth:0}}><div style={{fontWeight:700,fontSize:13,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{usuario.nome}</div><div style={{fontSize:10,color:C.textMuted,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{usuario.email}</div></div>
            <button onClick={()=>{if(window.confirm("Deseja sair?"))auth.signOut();}} style={{background:"transparent",border:"none",color:C.textMuted,cursor:"pointer",fontSize:18}} title="Sair">↩</button>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div className="main-content">
        <div className="top-bar">
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              {editNomeTurma?(
                <input value={nomeEdit} onChange={e=>setNomeEdit(e.target.value)}
                  onBlur={()=>{renomearTurma(turmaAtual?.id,nomeEdit);setEditNomeTurma(false);}}
                  onKeyDown={e=>{if(e.key==="Enter"){renomearTurma(turmaAtual?.id,nomeEdit);setEditNomeTurma(false);}}}
                  autoFocus style={{background:"transparent",border:"none",borderBottom:`2px solid ${C.primary}`,color:C.text,fontSize:18,fontWeight:800,outline:"none",width:220}}/>
              ):(
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:18,fontWeight:800,color:C.text}}>{turmaAtual?.nome||"Selecione uma turma"}</span>
                  {turmaAtual&&<>
                    <button onClick={()=>{setNomeEdit(turmaAtual.nome);setEditNomeTurma(true);}} style={{background:"transparent",border:"none",color:C.textMuted,cursor:"pointer",fontSize:14}}>✏️</button>
                    <button onClick={()=>{setMData({turmaId:turmaAtual.id});setModal("delTurma");}} style={{background:"transparent",border:"none",color:C.textMuted,cursor:"pointer",fontSize:13}}>🗑️</button>
                  </>}
                </div>
              )}
              <div style={{fontSize:11,color:C.textMuted,marginTop:2}}>{ABAS.find(a=>a.id===aba)?.icon} {ABAS.find(a=>a.id===aba)?.label} · {alunos.length} alunos</div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:34,height:34,borderRadius:50,background:C.primaryBg,border:`2px solid ${C.primary}`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:15,color:C.primary}}>{usuario.nome.charAt(0).toUpperCase()}</div>
              <button onClick={()=>{if(window.confirm("Deseja sair?"))auth.signOut();}} style={{background:"#f1f5f9",border:"none",borderRadius:8,padding:"5px 12px",color:C.textSub,fontWeight:600,fontSize:12,cursor:"pointer"}}>Sair</button>
            </div>
          </div>
        </div>

        <div className="page-content">
          <Toast toast={toast}/>

          {/* RANKING */}
          {aba==="ranking"&&(
            <div>
              <h2 style={{fontSize:20,fontWeight:800,color:C.text,marginBottom:20}}>🏆 Ranking de Aura</h2>
              <div className="content-grid">
                <div>
                  {ranking.length===0&&<Card><div style={{textAlign:"center",color:C.textMuted,padding:"40px 0"}}><div style={{fontSize:48,marginBottom:12}}>🎮</div>Nenhum aluno ainda.<br/>Vá para a aba Alunos!</div></Card>}
                  {ranking.map((aluno,idx)=>{
                    const nivel=getNivel(aluno.pontos);const prox=NIVEIS[Math.min(NIVEIS.length-1,nivel.id+1)];const isSel=selId===aluno.id;
                    return(
                      <div key={aluno.id} onClick={()=>{setSelId(isSel?null:aluno.id);if(!isSel)setAba("registrar");}}
                        style={{background:isSel?nivel.bg:C.card,border:`1.5px solid ${isSel?nivel.cor:C.border}`,borderRadius:14,padding:"14px 16px",marginBottom:10,cursor:"pointer",transition:"all 0.2s",boxShadow:isSel?`0 2px 16px ${nivel.cor}25`:"0 1px 4px #0000000a"}}>
                        <div style={{display:"flex",alignItems:"center",gap:12}}>
                          <div style={{width:36,height:36,borderRadius:10,background:idx<3?nivel.bg:"#f1f5f9",display:"flex",alignItems:"center",justifyContent:"center",fontSize:idx<3?20:14,flexShrink:0,border:`1px solid ${C.border}`,fontWeight:700,color:C.textSub}}>
                            {idx===0?"🥇":idx===1?"🥈":idx===2?"🥉":`#${idx+1}`}
                          </div>
                          <span style={{fontSize:26}}>{nivel.emoji}</span>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{fontWeight:700,fontSize:15,color:C.text,marginBottom:3}}>{aluno.nome}</div>
                            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}><Chip cor={nivel.cor} bg={nivel.bg}>{nivel.nome}</Chip><Stars count={nivel.stars}/></div>
                            {nivel.id>=0&&<ProgressBar valor={aluno.pontos-nivel.min} max={nivel.id<NIVEIS.length-1?prox.min-nivel.min:1} cor={nivel.cor}/>}
                            {nivel.id>=0&&nivel.id<NIVEIS.length-1&&<div style={{fontSize:10,color:C.textMuted,marginTop:3}}>{(prox.min-aluno.pontos).toLocaleString()} para {prox.nome}</div>}
                            {nivel.id===-1&&<div style={{fontSize:10,color:C.red,marginTop:3}}>⚠️ Aura negativa — precisa recuperar!</div>}
                          </div>
                          <div style={{textAlign:"right",flexShrink:0,minWidth:70}}>
                            <div style={{fontWeight:900,fontSize:20,color:nivel.cor}}>{aluno.pontos.toLocaleString()}</div>
                            <div style={{fontSize:10,color:C.textMuted,fontWeight:600}}>AURA</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div>
                  <Card>
                    <Label>Tabela de Níveis — Bimestre</Label>
                    {NIVEIS.map(n=>(
                      <div key={n.id} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:`1px solid ${C.border}`}}>
                        <span style={{fontSize:22,width:28,textAlign:"center"}}>{n.emoji}</span>
                        <div style={{flex:1}}><Chip cor={n.cor} bg={n.bg}>{n.nome}</Chip><div style={{color:C.textMuted,fontSize:11,marginTop:2}}>"{n.frase}"</div></div>
                        <div style={{textAlign:"right"}}><Stars count={n.stars}/><div style={{color:C.textMuted,fontSize:10,marginTop:1}}>{n.min===0?"0":n.min.toLocaleString()}+ pts</div></div>
                      </div>
                    ))}
                  </Card>
                  {alunos.length>0&&(
                    <Card style={{marginTop:16}}>
                      <Label>Estatísticas</Label>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                        {[["🏅","Maior Aura",ranking[0]?`${ranking[0].pontos.toLocaleString()} pts`:"—"],["📊","Média",`${Math.round(alunos.reduce((s,a)=>s+a.pontos,0)/alunos.length).toLocaleString()} pts`],["👥","Total",alunos.length],["✨","Infinita",alunos.filter(a=>getNivel(a.pontos).id===7).length]].map(([icon,label,val])=>(
                          <div key={label} style={{background:"#f8f9fb",borderRadius:10,padding:"12px 14px"}}>
                            <div style={{fontSize:20,marginBottom:4}}>{icon}</div>
                            <div style={{fontSize:11,color:C.textMuted}}>{label}</div>
                            <div style={{fontSize:16,fontWeight:800,color:C.text}}>{val}</div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* REGISTRAR */}
          {aba==="registrar"&&(
            <div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
                <h2 style={{fontSize:20,fontWeight:800,color:C.text}}>⚡ Registrar Aura</h2>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>{setModoMassa(false);setAcaoMassa(null);setAlunosMassa(new Set());}}
                    style={{background:!modoMassa?C.primary:"#f1f5f9",border:"none",borderRadius:10,padding:"8px 14px",color:!modoMassa?"#fff":C.textSub,fontWeight:700,fontSize:13,cursor:"pointer"}}>
                    👤 Individual
                  </button>
                  <button onClick={()=>{setModoMassa(true);setSelId(null);setAcaoMassa(null);setAlunosMassa(new Set());}}
                    style={{background:modoMassa?C.primary:"#f1f5f9",border:"none",borderRadius:10,padding:"8px 14px",color:modoMassa?"#fff":C.textSub,fontWeight:700,fontSize:13,cursor:"pointer"}}>
                    👥 Em Massa
                  </button>
                </div>
              </div>

              {/* MODO EM MASSA */}
              {modoMassa&&(
                <div>
                  <div style={{background:C.primaryBg,border:`1px solid ${C.primary}30`,borderRadius:14,padding:16,marginBottom:20}}>
                    <div style={{fontWeight:700,fontSize:14,color:C.primary,marginBottom:4}}>👥 Modo Em Massa</div>
                    <div style={{fontSize:13,color:C.textSub}}>1. Selecione uma ação → 2. Marque os alunos → 3. Clique em Aplicar</div>
                  </div>
                  <div className="content-grid">
                    {/* Coluna ações */}
                    <div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}}>
                        <div>
                          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10,padding:"6px 12px",background:C.greenBg,borderRadius:8}}>
                            <span style={{fontSize:14}}>✅</span><span style={{fontWeight:700,fontSize:12,color:C.green}}>POSITIVAS</span>
                          </div>
                          <div style={{display:"flex",flexDirection:"column",gap:8}}>
                            {acoes.filter(a=>a.valor>0).map(acao=>(
                              <button key={acao.id} onClick={()=>setAcaoMassa(acaoMassa?.id===acao.id?null:acao)}
                                style={{background:acaoMassa?.id===acao.id?acao.cor:acao.corBg||C.greenBg,border:`2px solid ${acaoMassa?.id===acao.id?acao.cor:acao.cor+"40"}`,borderRadius:12,padding:"12px 10px",cursor:"pointer",display:"flex",alignItems:"center",gap:10,transition:"all 0.15s",textAlign:"left"}}>
                                <span style={{fontSize:20,flexShrink:0}}>{acao.icon}</span>
                                <span style={{color:acaoMassa?.id===acao.id?"#fff":acao.cor,fontWeight:700,fontSize:12,flex:1}}>{acao.label}</span>
                                <span style={{color:acaoMassa?.id===acao.id?"#fff":C.green,fontWeight:900,fontSize:14,flexShrink:0}}>+{acao.valor}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10,padding:"6px 12px",background:C.redBg,borderRadius:8}}>
                            <span style={{fontSize:14}}>❌</span><span style={{fontWeight:700,fontSize:12,color:C.red}}>NEGATIVAS</span>
                          </div>
                          <div style={{display:"flex",flexDirection:"column",gap:8}}>
                            {acoes.filter(a=>a.valor<0).map(acao=>(
                              <button key={acao.id} onClick={()=>setAcaoMassa(acaoMassa?.id===acao.id?null:acao)}
                                style={{background:acaoMassa?.id===acao.id?acao.cor:acao.corBg||C.redBg,border:`2px solid ${acaoMassa?.id===acao.id?acao.cor:acao.cor+"40"}`,borderRadius:12,padding:"12px 10px",cursor:"pointer",display:"flex",alignItems:"center",gap:10,transition:"all 0.15s",textAlign:"left"}}>
                                <span style={{fontSize:20,flexShrink:0}}>{acao.icon}</span>
                                <span style={{color:acaoMassa?.id===acao.id?"#fff":acao.cor,fontWeight:700,fontSize:12,flex:1}}>{acao.label}</span>
                                <span style={{color:acaoMassa?.id===acao.id?"#fff":C.red,fontWeight:900,fontSize:14,flexShrink:0}}>{acao.valor}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Coluna alunos */}
                    <div>
                      {acaoMassa&&(
                        <div style={{background:acaoMassa.corBg,border:`2px solid ${acaoMassa.cor}`,borderRadius:12,padding:"12px 16px",marginBottom:16,display:"flex",alignItems:"center",gap:10}}>
                          <span style={{fontSize:24}}>{acaoMassa.icon}</span>
                          <div style={{flex:1}}><div style={{fontWeight:800,color:acaoMassa.cor}}>{acaoMassa.label}</div><div style={{fontSize:12,color:C.textSub}}>Ação selecionada</div></div>
                          <span style={{fontWeight:900,fontSize:20,color:acaoMassa.valor>0?C.green:C.red}}>{acaoMassa.valor>0?"+":""}{acaoMassa.valor}</span>
                        </div>
                      )}
                      {!acaoMassa&&<div style={{background:"#f8f9fb",border:`1px dashed ${C.borderMd}`,borderRadius:12,padding:16,marginBottom:16,textAlign:"center",color:C.textMuted,fontSize:13}}>← Selecione uma ação primeiro</div>}

                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                        <Label style={{marginBottom:0}}>{alunosMassa.size} selecionado(s)</Label>
                        <button onClick={()=>setAlunosMassa(prev=>prev.size===ranking.length?new Set():new Set(ranking.map(a=>a.id)))}
                          style={{fontSize:12,color:C.primary,background:"transparent",border:"none",cursor:"pointer",fontWeight:700}}>
                          {alunosMassa.size===ranking.length?"Desmarcar todos":"Selecionar todos"}
                        </button>
                      </div>
                      <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:16}}>
                        {ranking.map(a=>{
                          const nivel=getNivel(a.pontos);const isSel=alunosMassa.has(a.id);
                          return(
                            <div key={a.id} onClick={()=>{setAlunosMassa(prev=>{const s=new Set(prev);s.has(a.id)?s.delete(a.id):s.add(a.id);return s;});}}
                              style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:isSel?nivel.bg:C.card,border:`1.5px solid ${isSel?nivel.cor:C.border}`,borderRadius:12,cursor:"pointer",transition:"all 0.15s"}}>
                              <div style={{width:20,height:20,borderRadius:5,border:`2px solid ${isSel?nivel.cor:C.borderMd}`,background:isSel?nivel.cor:"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                                {isSel&&<span style={{color:"#fff",fontSize:12,fontWeight:900}}>✓</span>}
                              </div>
                              <span style={{fontSize:18}}>{nivel.emoji}</span>
                              <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13,color:C.text}}>{a.nome}</div><div style={{fontSize:11,color:nivel.cor,fontWeight:700}}>{a.pontos.toLocaleString()} pts</div></div>
                            </div>
                          );
                        })}
                      </div>
                      <button onClick={()=>acaoMassa&&aplicarAcaoMassa(acaoMassa,alunosMassa)}
                        disabled={!acaoMassa||alunosMassa.size===0}
                        style={{width:"100%",background:!acaoMassa||alunosMassa.size===0?"#e2e8f0":acaoMassa.valor>0?C.green:C.red,border:"none",borderRadius:12,padding:"14px",color:!acaoMassa||alunosMassa.size===0?C.textMuted:"#fff",fontWeight:800,fontSize:15,cursor:!acaoMassa||alunosMassa.size===0?"not-allowed":"pointer",transition:"all 0.2s"}}>
                        {!acaoMassa?"Selecione uma ação":alunosMassa.size===0?"Selecione os alunos":`Aplicar ${acaoMassa.icon} para ${alunosMassa.size} aluno(s)`}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* MODO INDIVIDUAL */}
              {!modoMassa&&(
              <div className="content-grid">
                <div>
                  <Label>Selecionar Aluno</Label>
                  <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:20}}>
                    {ranking.map(a=>{const nivel=getNivel(a.pontos);const isSel=selId===a.id;
                      return <button key={a.id} onClick={()=>setSelId(isSel?null:a.id)}
                        style={{background:isSel?nivel.bg:"#f1f5f9",border:`1.5px solid ${isSel?nivel.cor:C.border}`,borderRadius:99,padding:"7px 14px",color:isSel?nivel.cor:C.textSub,fontWeight:isSel?700:500,fontSize:13,cursor:"pointer",transition:"all 0.15s"}}>
                        {nivel.emoji} {a.nome}</button>;})}
                    {alunos.length===0&&<div style={{color:C.textMuted,fontSize:13}}>Adicione alunos primeiro.</div>}
                  </div>
                  {alunoSel&&nivelSel&&(
                    <Card style={{background:nivelSel.bg,border:`1.5px solid ${nivelSel.cor}40`,marginBottom:20}}>
                      <div style={{display:"flex",alignItems:"center",gap:16}}>
                        <div style={{textAlign:"center"}}><div style={{fontSize:46}}>{nivelSel.emoji}</div><Stars count={nivelSel.stars}/></div>
                        <div style={{flex:1}}>
                          <div style={{fontWeight:800,fontSize:20,color:C.text}}>{alunoSel.nome}</div>
                          <Chip cor={nivelSel.cor} bg="#fff" size="lg">{nivelSel.nome}</Chip>
                          <div style={{color:C.textSub,fontSize:12,fontStyle:"italic",margin:"6px 0 10px"}}>"{nivelSel.frase}"</div>
                          <div style={{fontSize:28,fontWeight:900,color:nivelSel.cor}}>{alunoSel.pontos.toLocaleString()} <span style={{fontSize:13,fontWeight:600,color:C.textSub}}>AURA</span></div>
                          {nivelSel.id<NIVEIS.length-1&&proxNivel&&(<div style={{marginTop:8}}><ProgressBar valor={alunoSel.pontos-nivelSel.min} max={proxNivel.min-nivelSel.min} cor={nivelSel.cor}/><div style={{color:C.textMuted,fontSize:11,marginTop:4}}>{(proxNivel.min-alunoSel.pontos).toLocaleString()} AURA para {proxNivel.nome}</div></div>)}
                        </div>
                      </div>
                    </Card>
                  )}
                </div>
                {alunoSel&&(
                  <div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}}>
                      {/* POSITIVAS */}
                      <div>
                        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10,padding:"6px 12px",background:C.greenBg,borderRadius:8}}>
                          <span style={{fontSize:14}}>✅</span>
                          <span style={{fontWeight:700,fontSize:12,color:C.green}}>POSITIVAS</span>
                        </div>
                        <div style={{display:"flex",flexDirection:"column",gap:8}}>
                          {acoes.filter(a=>a.valor>0).map(acao=>(
                            <button key={acao.id} onClick={()=>aplicarAcao(alunoSel.id,acao)}
                              style={{background:acao.corBg||C.greenBg,border:`1.5px solid ${acao.cor}40`,borderRadius:12,padding:"12px 10px",cursor:"pointer",display:"flex",alignItems:"center",gap:10,transition:"opacity 0.15s",textAlign:"left"}}
                              onMouseEnter={e=>e.currentTarget.style.opacity="0.8"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                              <span style={{fontSize:20,flexShrink:0}}>{acao.icon}</span>
                              <span style={{color:acao.cor,fontWeight:700,fontSize:12,flex:1}}>{acao.label}</span>
                              <span style={{color:C.green,fontWeight:900,fontSize:14,flexShrink:0}}>+{acao.valor}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                      {/* NEGATIVAS */}
                      <div>
                        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10,padding:"6px 12px",background:C.redBg,borderRadius:8}}>
                          <span style={{fontSize:14}}>❌</span>
                          <span style={{fontWeight:700,fontSize:12,color:C.red}}>NEGATIVAS</span>
                        </div>
                        <div style={{display:"flex",flexDirection:"column",gap:8}}>
                          {acoes.filter(a=>a.valor<0).map(acao=>(
                            <button key={acao.id} onClick={()=>aplicarAcao(alunoSel.id,acao)}
                              style={{background:acao.corBg||C.redBg,border:`1.5px solid ${acao.cor}40`,borderRadius:12,padding:"12px 10px",cursor:"pointer",display:"flex",alignItems:"center",gap:10,transition:"opacity 0.15s",textAlign:"left"}}
                              onMouseEnter={e=>e.currentTarget.style.opacity="0.8"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                              <span style={{fontSize:20,flexShrink:0}}>{acao.icon}</span>
                              <span style={{color:acao.cor,fontWeight:700,fontSize:12,flex:1}}>{acao.label}</span>
                              <span style={{color:C.red,fontWeight:900,fontSize:14,flexShrink:0}}>{acao.valor}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    {histAluno.length>0&&(<div>
                      <Label>Últimas ações de {alunoSel.nome}</Label>
                      {histAluno.slice(0,8).map(h=>(
                        <Card key={h.id} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8,padding:"10px 14px"}}>
                          <div style={{flex:1}}>
                            <div style={{fontSize:13,fontWeight:600,color:C.text}}>{h.icon} {h.acao}{h.editado&&<span style={{fontSize:10,color:C.textMuted,marginLeft:6}}>✏️ editado</span>}</div>
                            <div style={{color:C.textMuted,fontSize:10,marginTop:2}}>🕐 {h.data}</div>
                          </div>
                          <span style={{fontWeight:800,fontSize:14,color:h.valor>0?C.green:C.red,flexShrink:0}}>{h.valor>0?"+":""}{h.valor}</span>
                          <button onClick={()=>{setMData({histId:h.id,histAcao:h.acao,histValor:String(Math.abs(h.valor)),histTipo:h.valor>=0?"positivo":"negativo",alunoNome:alunoSel.nome});setModal("editHist");}}
                            style={{background:C.primaryBg,border:"none",borderRadius:7,color:C.primary,padding:"4px 8px",cursor:"pointer",fontSize:12,fontWeight:700,flexShrink:0}}>✏️</button>
                          <button onClick={()=>{setMData({histId:h.id,histAcao:h.acao,alunoNome:alunoSel.nome});setModal("delHist");}}
                            style={{background:C.redBg,border:"none",borderRadius:7,color:C.red,padding:"4px 8px",cursor:"pointer",fontSize:12,fontWeight:700,flexShrink:0}}>🗑️</button>
                        </Card>
                      ))}
                    </div>)}
                  </div>
                )}
              </div>
              )}
            </div>
          )}

          {/* ALUNOS */}
          {aba==="alunos"&&(
            <div>
              <h2 style={{fontSize:20,fontWeight:800,color:C.text,marginBottom:20}}>👥 Gerenciar Alunos</h2>
              <div className="content-grid">
                <div>
                  <Card style={{marginBottom:16}}>
                    <Label>Adicionar manualmente</Label>
                    <div style={{display:"flex",gap:8}}>
                      <Input value={novoNome} onChange={e=>setNovoNome(e.target.value)} onKeyDown={e=>e.key==="Enter"&&adicionarAlunoInput()} placeholder="Nome do aluno..."/>
                      <Btn onClick={adicionarAlunoInput} variant="primary">+ Add</Btn>
                    </div>
                  </Card>
                  <Card>
                    <Label>Importar lista</Label>
                    <div onDragOver={e=>{e.preventDefault();setImportDrag(true);}} onDragLeave={()=>setImportDrag(false)}
                      onDrop={async e=>{e.preventDefault();setImportDrag(false);const f=e.dataTransfer?.files?.[0];if(f)await processarArquivo(f);}}
                      onClick={()=>fileRef.current.click()}
                      style={{border:`2px dashed ${importDrag?C.primary:C.borderMd}`,borderRadius:12,padding:"24px 16px",textAlign:"center",cursor:"pointer",background:importDrag?C.primaryBg:"#f8f9fb",transition:"all 0.2s"}}>
                      <div style={{fontSize:36,marginBottom:8}}>{importLoading?"⏳":"📂"}</div>
                      <div style={{fontWeight:700,fontSize:14,color:importDrag?C.primary:C.textSub}}>{importLoading?"Lendo arquivo...":"Arrastar ou clicar para selecionar"}</div>
                      <div style={{fontSize:12,color:C.textMuted,marginTop:6}}>Excel (.xlsx/.xls), CSV, TXT, Word (.docx)</div>
                      <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv,.txt,.docx" style={{display:"none"}} onChange={e=>{if(e.target.files[0])processarArquivo(e.target.files[0]);e.target.value="";}}/>
                    </div>
                  </Card>
                </div>
                <div>
                  <Label>{alunos.length} aluno(s) — ordem alfabética</Label>
                  {alunos.length===0&&<Card><div style={{textAlign:"center",color:C.textMuted,padding:"30px 0"}}>Nenhum aluno ainda.</div></Card>}
                  {[...alunos].sort((a,b)=>a.nome.localeCompare(b.nome)).map(aluno=>{
                    const nivel=getNivel(aluno.pontos);
                    return(
                      <Card key={aluno.id} style={{display:"flex",alignItems:"center",gap:12,marginBottom:8,padding:"12px 16px"}}>
                        <span style={{fontSize:22}}>{nivel.emoji}</span>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontWeight:700,fontSize:14,color:C.text}}>{aluno.nome}</div>
                          <div style={{display:"flex",alignItems:"center",gap:6,marginTop:2}}><Chip cor={nivel.cor} bg={nivel.bg}>{nivel.nome}</Chip><span style={{color:C.textMuted,fontSize:12}}>{aluno.pontos.toLocaleString()} pts</span></div>
                        </div>
                        <div style={{display:"flex",gap:6}}>
                          <button onClick={()=>{setMData({alunoId:aluno.id,nome:aluno.nome,pontos:aluno.pontos});setModal("editPontos");}} style={{background:C.primaryBg,border:"none",borderRadius:8,color:C.primary,padding:"5px 10px",cursor:"pointer",fontSize:13,fontWeight:700}}>pts</button>
                          <button onClick={()=>{setMData({alunoId:aluno.id,nome:aluno.nome});setModal("delAluno");}} style={{background:"transparent",border:`1px solid ${C.border}`,borderRadius:8,color:C.textMuted,padding:"5px 9px",cursor:"pointer",fontSize:12}}>✕</button>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* AÇÕES */}
          {aba==="acoes"&&(
            <div className="content-single">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                <h2 style={{fontSize:20,fontWeight:800,color:C.text}}>🎯 Ações</h2>
                <Btn onClick={abrirNovaAcao} variant="success">+ Nova Ação</Btn>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>
                {acoes.map(acao=>(
                  <Card key={acao.id} style={{display:"flex",alignItems:"center",gap:12,padding:"14px 16px"}}>
                    <div style={{width:44,height:44,borderRadius:12,background:acao.corBg||"#f1f5f9",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{acao.icon}</div>
                    <div style={{flex:1}}><div style={{fontWeight:700,fontSize:14,color:acao.cor}}>{acao.label}</div>{acao.custom&&<Chip cor={C.primary} bg={C.primaryBg}>CUSTOM</Chip>}</div>
                    <div style={{fontWeight:900,fontSize:18,color:acao.valor>0?C.green:C.red,minWidth:56,textAlign:"right"}}>{acao.valor>0?"+":""}{acao.valor}</div>
                    <button onClick={()=>abrirEditAcao(acao)} style={{background:"#f1f5f9",border:"none",borderRadius:8,color:C.textSub,padding:"7px 11px",cursor:"pointer",fontSize:13}}>✏️</button>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* HISTÓRICO */}
          {aba==="historico"&&(
            <div className="content-single">
              <h2 style={{fontSize:20,fontWeight:800,color:C.text,marginBottom:8}}>📋 Histórico</h2>
              <div style={{color:C.textMuted,fontSize:13,marginBottom:16}}>{historico.length} registros · clique em um para editar ou apagar</div>
              {historico.length===0&&<Card><div style={{textAlign:"center",color:C.textMuted,padding:"30px 0"}}>Nenhum registro ainda.</div></Card>}
              {historico.map(h=>{
                const a=alunos.find(x=>x.id===h.alunoId);const n=a?getNivel(a.pontos):null;
                return(<Card key={h.id} style={{display:"flex",alignItems:"center",gap:12,marginBottom:8,padding:"11px 16px"}}>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:13,color:n?.cor||C.textSub}}>{n?.emoji||"❓"} {h.alunoNome}</div>
                    <div style={{color:C.textMuted,fontSize:11,marginTop:2}}>{h.icon} {h.acao} {h.editado?"· ✏️ editado":""}</div>
                    <div style={{color:C.textMuted,fontSize:10,marginTop:1}}>🕐 {h.data}</div>
                  </div>
                  <span style={{fontWeight:900,fontSize:16,color:h.valor>0?C.green:C.red,minWidth:50,textAlign:"right"}}>{h.valor>0?"+":""}{h.valor}</span>
                  <div style={{display:"flex",gap:6,flexShrink:0}}>
                    <button onClick={()=>{setMData({histId:h.id,histAcao:h.acao,histValor:String(Math.abs(h.valor)),histTipo:h.valor>=0?"positivo":"negativo",alunoNome:h.alunoNome});setModal("editHist");}}
                      style={{background:C.primaryBg,border:"none",borderRadius:8,color:C.primary,padding:"5px 9px",cursor:"pointer",fontSize:12,fontWeight:700}}>✏️</button>
                    <button onClick={()=>{setMData({histId:h.id,alunoNome:h.alunoNome,histAcao:h.acao});setModal("delHist");}}
                      style={{background:C.redBg,border:"none",borderRadius:8,color:C.red,padding:"5px 9px",cursor:"pointer",fontSize:12,fontWeight:700}}>🗑️</button>
                  </div>
                </Card>);
              })}
            </div>
          )}
        </div>
      </div>

      {/* MOBILE NAV */}
      <nav className="mobile-nav">
        {ABAS.map(item=>(
          <button key={item.id} onClick={()=>setAba(item.id)}
            style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2,background:"transparent",border:"none",color:aba===item.id?C.primary:C.textMuted,cursor:"pointer",padding:"4px 0",fontSize:10,fontWeight:aba===item.id?700:400}}>
            <span style={{fontSize:20}}>{item.icon}</span>{item.label}
          </button>
        ))}
      </nav>

      {/* MODAIS */}
      {modal==="novaTurma"&&(<Modal title="🏫 Nova Turma" onClose={()=>setModal(null)}>
        <Label>Nome da turma</Label>
        <Input placeholder="Ex: 9º Ano A..." value={mData.nome||""} onChange={e=>setMData(d=>({...d,nome:e.target.value}))} onKeyDown={e=>{if(e.key==="Enter"&&mData.nome?.trim()){criarTurma(mData.nome);setModal(null);}}} style={{marginBottom:16}}/>
        <div style={{display:"flex",gap:8}}><Btn onClick={()=>setModal(null)} variant="ghost" style={{flex:1}}>Cancelar</Btn><Btn onClick={()=>{if(mData.nome?.trim()){criarTurma(mData.nome);setModal(null);}}} variant="primary" style={{flex:2}}>Criar</Btn></div>
      </Modal>)}

      {modal==="acao"&&(<Modal title={mData.editId?"✏️ Editar Ação":"➕ Nova Ação"} onClose={()=>setModal(null)}>
        <Label>Nome</Label><Input value={formAcao.label} onChange={e=>setFormAcao(f=>({...f,label:e.target.value}))} placeholder="Ex: Prova Entregue..." style={{marginBottom:12}}/>
        <Label>Tipo</Label>
        <div style={{display:"flex",gap:8,marginBottom:12}}>
          {[["positivo","✅ Positiva",C.green,C.greenBg],["negativo","❌ Negativa",C.red,C.redBg]].map(([val,lbl,cor,bg])=>(
            <button key={val} onClick={()=>setFormAcao(f=>({...f,tipo:val}))} style={{flex:1,background:formAcao.tipo===val?bg:"#f1f5f9",border:`1.5px solid ${formAcao.tipo===val?cor:C.border}`,borderRadius:10,padding:"9px",color:formAcao.tipo===val?cor:C.textSub,fontWeight:700,fontSize:13,cursor:"pointer"}}>{lbl}</button>
          ))}
        </div>
        <Label>Valor</Label><Input type="number" min={1} value={formAcao.valor} onChange={e=>setFormAcao(f=>({...f,valor:e.target.value}))} placeholder="Ex: 300" style={{marginBottom:12}}/>
        <Label>Ícone</Label>
        <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:12}}>{EMOJIS.map(em=><button key={em} onClick={()=>setFormAcao(f=>({...f,icon:em}))} style={{fontSize:18,background:formAcao.icon===em?C.primaryBg:"#f1f5f9",border:`2px solid ${formAcao.icon===em?C.primary:"transparent"}`,borderRadius:8,padding:"3px 6px",cursor:"pointer"}}>{em}</button>)}</div>
        <Label>Cor</Label>
        <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:14}}>{CORES.map(({cor,bg})=><button key={cor} onClick={()=>setFormAcao(f=>({...f,cor,corBg:bg}))} style={{width:28,height:28,borderRadius:50,background:cor,border:`3px solid ${formAcao.cor===cor?C.text:"transparent"}`,cursor:"pointer"}}/>)}</div>
        <div style={{background:formAcao.corBg||"#f1f5f9",border:`1.5px solid ${formAcao.cor}30`,borderRadius:12,padding:"12px 16px",marginBottom:16,display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontSize:24}}>{formAcao.icon}</span>
          <span style={{color:formAcao.cor,fontWeight:700,fontSize:15}}>{formAcao.label||"Prévia"}</span>
          <span style={{marginLeft:"auto",fontWeight:900,color:formAcao.tipo==="positivo"?C.green:C.red,fontSize:16}}>{formAcao.tipo==="positivo"?"+":"-"}{formAcao.valor||"0"}</span>
        </div>
        <div style={{display:"flex",gap:8}}>
          <Btn onClick={()=>setModal(null)} variant="ghost" style={{flex:1}}>Cancelar</Btn>
          {mData.editId&&mData.custom&&<Btn onClick={()=>setModal("delAcao")} variant="danger">🗑️</Btn>}
          <Btn onClick={()=>salvarAcao(mData.editId||null)} variant="success" style={{flex:2}}>Salvar</Btn>
        </div>
      </Modal>)}

      {modal==="editPontos"&&(<Modal title="✏️ Editar Pontos" onClose={()=>setModal(null)}>
        <div style={{color:C.textSub,fontSize:14,marginBottom:14}}>Ajustar pontos de <b style={{color:C.text}}>{mData.nome}</b></div>
        <Label>Pontos</Label>
        <Input type="number" min={0} value={mData.pontos??""} onChange={e=>setMData(d=>({...d,pontos:parseInt(e.target.value)||0}))} style={{marginBottom:16}}/>
        <div style={{display:"flex",gap:8}}><Btn onClick={()=>setModal(null)} variant="ghost" style={{flex:1}}>Cancelar</Btn><Btn onClick={()=>{editarPontos(mData.alunoId,mData.pontos);setModal(null);}} variant="primary" style={{flex:2}}>Salvar</Btn></div>
      </Modal>)}

      {modal==="import"&&(<Modal title={`📂 Importar "${mData.fileName}"`} onClose={()=>setModal(null)} maxWidth={500}>
        <div style={{color:C.textSub,fontSize:13,marginBottom:12}}>{importNomes.length} nome(s) encontrado(s) para <b style={{color:C.text}}>{turmaAtual?.nome}</b>:</div>
        <ImportSelector nomes={importNomes} alunosExistentes={alunos} onConfirm={confirmarImport} onCancel={()=>setModal(null)}/>
      </Modal>)}

      {modal==="delAluno"&&(<Modal title="Remover aluno?" onClose={()=>setModal(null)}>
        <div style={{color:C.textSub,fontSize:14,marginBottom:18}}>Isso vai apagar <b style={{color:C.text}}>{mData.nome}</b> e todo o histórico.</div>
        <div style={{display:"flex",gap:8}}><Btn onClick={()=>setModal(null)} variant="ghost" style={{flex:1}}>Cancelar</Btn><Btn onClick={()=>{removerAluno(mData.alunoId);setModal(null);}} variant="danger" style={{flex:1}}>Remover</Btn></div>
      </Modal>)}

      {modal==="delTurma"&&(<Modal title="Deletar turma?" onClose={()=>setModal(null)}>
        <div style={{color:C.textSub,fontSize:14,marginBottom:18}}>Todos os dados de <b style={{color:C.text}}>{turmaAtual?.nome}</b> serão removidos.</div>
        <div style={{display:"flex",gap:8}}><Btn onClick={()=>setModal(null)} variant="ghost" style={{flex:1}}>Cancelar</Btn><Btn onClick={()=>{deletarTurma(mData.turmaId);setModal(null);}} variant="danger" style={{flex:1}}>Deletar</Btn></div>
      </Modal>)}

      {modal==="delAcao"&&(<Modal title="Remover ação?" onClose={()=>setModal(null)}>
        <div style={{color:C.textSub,fontSize:14,marginBottom:18}}>A ação <b style={{color:C.text}}>{formAcao.label}</b> será removida.</div>
        <div style={{display:"flex",gap:8}}><Btn onClick={()=>setModal("acao")} variant="ghost" style={{flex:1}}>Cancelar</Btn><Btn onClick={()=>deletarAcao(mData.editId)} variant="danger" style={{flex:1}}>Remover</Btn></div>
      </Modal>)}

      {modal==="editHist"&&(<Modal title="✏️ Editar Registro" onClose={()=>setModal(null)}>
        <div style={{color:C.textSub,fontSize:13,marginBottom:14}}>Editando registro de <b style={{color:C.text}}>{mData.alunoNome}</b></div>
        <Label>Descrição da ação</Label>
        <Input value={mData.histAcao||""} onChange={e=>setMData(d=>({...d,histAcao:e.target.value}))} placeholder="Ex: Participação" style={{marginBottom:12}}/>
        <Label>Tipo</Label>
        <div style={{display:"flex",gap:8,marginBottom:12}}>
          {[["positivo","✅ Positivo",C.green,C.greenBg],["negativo","❌ Negativo",C.red,C.redBg]].map(([val,lbl,cor,bg])=>(
            <button key={val} onClick={()=>setMData(d=>({...d,histTipo:val}))} style={{flex:1,background:mData.histTipo===val?bg:"#f1f5f9",border:`1.5px solid ${mData.histTipo===val?cor:C.border}`,borderRadius:10,padding:"9px",color:mData.histTipo===val?cor:C.textSub,fontWeight:700,fontSize:13,cursor:"pointer"}}>{lbl}</button>
          ))}
        </div>
        <Label>Valor de Aura</Label>
        <Input type="number" min={1} value={mData.histValor||""} onChange={e=>setMData(d=>({...d,histValor:e.target.value}))} placeholder="Ex: 150" style={{marginBottom:16}}/>
        <div style={{background:"#f8f9fb",borderRadius:10,padding:"10px 14px",marginBottom:16,fontSize:13,color:C.textSub}}>
          ⚠️ Editar recalcula automaticamente os pontos do aluno.
        </div>
        <div style={{display:"flex",gap:8}}>
          <Btn onClick={()=>setModal(null)} variant="ghost" style={{flex:1}}>Cancelar</Btn>
          <Btn onClick={()=>{
            const val=parseInt(mData.histValor,10);
            if(!mData.histAcao?.trim()||isNaN(val)||val===0){showToast("Preencha todos os campos!","error");return;}
            const finalVal=mData.histTipo==="negativo"?-Math.abs(val):Math.abs(val);
            editarHistorico(mData.histId,finalVal,mData.histAcao.trim());
            setModal(null);
          }} variant="primary" style={{flex:2}}>Salvar</Btn>
        </div>
      </Modal>)}

      {modal==="delHist"&&(<Modal title="Apagar registro?" onClose={()=>setModal(null)}>
        <div style={{color:C.textSub,fontSize:14,marginBottom:8}}>Apagar o registro de <b style={{color:C.text}}>{mData.histAcao}</b> de <b style={{color:C.text}}>{mData.alunoNome}</b>?</div>
        <div style={{background:C.yellowBg,border:`1px solid ${C.yellow}40`,borderRadius:10,padding:"10px 14px",fontSize:13,color:C.yellow,fontWeight:600,marginBottom:18}}>
          ⚠️ Os pontos do aluno serão recalculados automaticamente.
        </div>
        <div style={{display:"flex",gap:8}}>
          <Btn onClick={()=>setModal(null)} variant="ghost" style={{flex:1}}>Cancelar</Btn>
          <Btn onClick={()=>{apagarHistorico(mData.histId);setModal(null);}} variant="danger" style={{flex:1}}>Apagar</Btn>
        </div>
      </Modal>)}
    </div>
  );
}

function ImportSelector({nomes,alunosExistentes,onConfirm,onCancel}) {
  const existentes=new Set(alunosExistentes.map(a=>a.nome.toLowerCase()));
  const [sel,setSel]=useState(()=>new Set(nomes.filter(n=>!existentes.has(n.toLowerCase()))));
  const disponiveis=nomes.filter(n=>!existentes.has(n.toLowerCase()));
  function toggle(n){setSel(prev=>{const s=new Set(prev);s.has(n)?s.delete(n):s.add(n);return s;});}
  function toggleAll(){setSel(prev=>prev.size===disponiveis.length?new Set():new Set(disponiveis));}
  return(<div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
      <span style={{fontSize:12,color:C.textSub}}>{sel.size} selecionado(s)</span>
      <button onClick={toggleAll} style={{fontSize:12,color:C.primary,background:"transparent",border:"none",cursor:"pointer",fontWeight:700}}>{sel.size===disponiveis.length?"Desmarcar todos":"Selecionar todos"}</button>
    </div>
    <div style={{maxHeight:280,overflowY:"auto",border:`1px solid ${C.border}`,borderRadius:10,marginBottom:16}}>
      {nomes.map((nome,i)=>{
        const jaExiste=existentes.has(nome.toLowerCase());const marcado=sel.has(nome);
        return(<div key={i} onClick={()=>!jaExiste&&toggle(nome)}
          style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderBottom:i<nomes.length-1?`1px solid ${C.border}`:"none",cursor:jaExiste?"default":"pointer",background:jaExiste?"#f8f9fb":marcado?C.primaryBg:"#fff"}}>
          <div style={{width:20,height:20,borderRadius:5,border:`2px solid ${jaExiste?C.borderMd:marcado?C.primary:C.borderMd}`,background:marcado&&!jaExiste?C.primary:"#fff",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            {marcado&&!jaExiste&&<span style={{color:"#fff",fontSize:12,fontWeight:900}}>✓</span>}
          </div>
          <span style={{fontSize:13,fontWeight:600,color:jaExiste?C.textMuted:C.text,flex:1}}>{nome}</span>
          {jaExiste&&<span style={{fontSize:10,color:C.textMuted,background:"#f1f5f9",borderRadius:99,padding:"2px 8px",fontWeight:600}}>já existe</span>}
        </div>);
      })}
    </div>
    <div style={{display:"flex",gap:8}}>
      <Btn onClick={onCancel} variant="ghost" style={{flex:1}}>Cancelar</Btn>
      <Btn onClick={()=>onConfirm([...sel])} variant="primary" style={{flex:2}} disabled={sel.size===0}>Importar {sel.size>0?`${sel.size} aluno(s)`:""}</Btn>
    </div>
  </div>);
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
