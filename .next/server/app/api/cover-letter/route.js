(()=>{var e={};e.id=316,e.ids=[316],e.modules={846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},4870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},3295:e=>{"use strict";e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},9294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},3033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},9021:e=>{"use strict";e.exports=require("fs")},1630:e=>{"use strict";e.exports=require("http")},5591:e=>{"use strict";e.exports=require("https")},3873:e=>{"use strict";e.exports=require("path")},1997:e=>{"use strict";e.exports=require("punycode")},7910:e=>{"use strict";e.exports=require("stream")},9551:e=>{"use strict";e.exports=require("url")},8354:e=>{"use strict";e.exports=require("util")},3566:e=>{"use strict";e.exports=require("worker_threads")},4075:e=>{"use strict";e.exports=require("zlib")},3024:e=>{"use strict";e.exports=require("node:fs")},7075:e=>{"use strict";e.exports=require("node:stream")},7830:e=>{"use strict";e.exports=require("node:stream/web")},5348:(e,r,t)=>{"use strict";t.r(r),t.d(r,{patchFetch:()=>m,routeModule:()=>l,serverHooks:()=>x,workAsyncStorage:()=>d,workUnitAsyncStorage:()=>h});var s={};t.r(s),t.d(s,{POST:()=>c});var o=t(2706),i=t(8203),a=t(5994),n=t(7590),u=t(9187);let p=new n.Ay({apiKey:process.env.OPENAI_API_KEY});async function c(e){try{let{resumeData:r,jobDescription:t}=await e.json();if(!r||!t)return u.NextResponse.json({error:"Resume data and job description are required"},{status:400});let s=`You are a professional career coach and expert cover letter writer. 
        Your goal is to write a highly persuasive, professional, and tailored cover letter.
        
        Guidelines:
        1. Use the provided resume data to highlight relevant skills and experiences.
        2. Tailor the content specifically to the job description provided.
        3. Keep it to 3-4 paragraphs.
        4. Tone should be professional yet enthusiastic.
        5. Use a modern, high-impact writing style.
        6. Do NOT use generic placeholders like [Company Name] if the information is available or can be inferred, but use them if it's missing.
        7. Focus on the value the candidate brings to the specific role.`,o=`
        RESUME DATA:
        ${JSON.stringify(r)}

        JOB DESCRIPTION:
        ${t}

        Please generate the cover letter now.
        `,i=(await p.chat.completions.create({model:"gpt-4-turbo-preview",messages:[{role:"system",content:s},{role:"user",content:o}],temperature:.7})).choices[0].message.content;return u.NextResponse.json({content:i})}catch(e){return console.error("OpenAI Cover Letter Error:",e),u.NextResponse.json({error:e.message||"Failed to generate cover letter"},{status:500})}}let l=new o.AppRouteRouteModule({definition:{kind:i.RouteKind.APP_ROUTE,page:"/api/cover-letter/route",pathname:"/api/cover-letter",filename:"route",bundlePath:"app/api/cover-letter/route"},resolvedPagePath:"C:\\Users\\hp\\OneDrive - PKM EDUCATIONAL TRUST\\Documents\\Resume_Builder\\src\\app\\api\\cover-letter\\route.ts",nextConfigOutput:"",userland:s}),{workAsyncStorage:d,workUnitAsyncStorage:h,serverHooks:x}=l;function m(){return(0,a.patchFetch)({workAsyncStorage:d,workUnitAsyncStorage:h})}},6487:()=>{},8335:()=>{}};var r=require("../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),s=r.X(0,[638,452,590],()=>t(5348));module.exports=s})();