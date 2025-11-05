/* // Smooth snap between sections, prevent leaving form if invalid,
    // compute live age, manage filled/empty chips, and control floating back buttons.
    (function(){
      const sections = Array.from(document.querySelectorAll('.section'));
      const body = document.body;

      // ---- Smooth navigate (no scroll wheel)
      function goTo(id){
        const el = document.querySelector(id);
        if(!el) return;
        el.scrollIntoView({behavior:'smooth', block:'start'});
      }

      // ---- Enable [data-nav] anchors and [data-back] buttons
      document.querySelectorAll('[data-nav], [data-back]').forEach(el=>{
        el.addEventListener('click', (e)=>{
          const targetHref = el.getAttribute('href') || el.dataset.target || el.getAttribute('data-target');
          const current = getCurrentSection();
          // If current section contains a required form, block leaving if invalid
          if(current && current.querySelector('form')){
            const form = current.querySelector('form');
            if(!form.checkValidity()){
              e.preventDefault();
              pulseInvalid(form);
              return;
            }
          }
          // Use href (e.g., "#signup") if present
          if(targetHref && targetHref.startsWith('#')){
            e.preventDefault();
            goTo(targetHref);
          }
        });
      });

      // Hide the floating "up" button on the first section
      function updateFabVisibility(){
        const current = getCurrentSection();
        const fabOnThis = current?.querySelector('.fab-up');
        // Hide all fabs first
        document.querySelectorAll('.fab-up').forEach(f=>f.style.display='flex');
        // First section's fab hidden
        const firstFab = sections[0].querySelector('.fab-up');
        if(firstFab) firstFab.style.display = 'none';
        // Ensure current section's fab is visible (except first)
        if(fabOnThis && current !== sections[0]) fabOnThis.style.display='grid';
      }

      // Determine which section is "current" by closest to viewport top
      function getCurrentSection(){
        const y = window.scrollY;
        let best = sections[0], bestDelta = Infinity;
        sections.forEach(s=>{
          const d = Math.abs(s.getBoundingClientRect().top);
          if(d < bestDelta){ best = s; bestDelta = d; }
        });
        return best;
      }

      // ---- Form logic
      const form = document.getElementById('profileForm');
      const first = document.getElementById('firstName');
      const last  = document.getElementById('lastName');
      const dob   = document.getElementById('dob');
      const ageOut= document.getElementById('ageOut');

      // Set DOB max to today (no future birthdays)
      (function setDobBounds(){
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth()+1).padStart(2,'0');
        const dd = String(today.getDate()).padStart(2,'0');
        dob.max = `${yyyy}-${mm}-${dd}`;
      })();

      // Live state chip & age compute
      [first,last,dob].forEach(inp=>{
        inp.addEventListener('input', ()=>{
          updateStateChip(inp);
          if(inp === dob) computeAge();
        });
        // initial state
        updateStateChip(inp);
      });

      function updateStateChip(input){
        const chip = input.parentElement.querySelector('.state');
        if(!chip) return;
        const filled = input.type === 'date' ? !!input.value : !input.matches(':placeholder-shown');
        const valid  = input.checkValidity();
        chip.textContent = filled ? (valid ? 'Filled ✓' : 'Check ⚠') : 'Empty';
      }

      function computeAge(){
        if(!dob.value){ ageOut.textContent = 'Age: —'; return; }
        const birth = new Date(dob.value + 'T00:00:00');
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
        ageOut.textContent = isFinite(age) ? `Age: ${age}` : 'Age: —';
      }

      // Prevent leaving form section if invalid: we intercept anchor clicks above.
      // Also on submit, if valid we could proceed to a "next" section; for now show a confirmation.
      form.addEventListener('submit', (e)=>{
        if(!form.checkValidity()){
          e.preventDefault();
          pulseInvalid(form);
          return;
        }
        e.preventDefault(); // No backend yet
        // You can navigate or show success. For demo, return to hero.
        goTo('#hero');
      });

      function pulseInvalid(formEl){
        // find first invalid field, focus it, and shake its wrapper
        const firstBad = formEl.querySelector(':invalid');
        if(firstBad){
          firstBad.focus({preventScroll:true});
          const wrap = firstBad.closest('.field');
          wrap?.classList.add('shake');
          setTimeout(()=>wrap?.classList.remove('shake'), 300);
        }
        // refresh chips
        [first,last,dob].forEach(updateStateChip);
      }

      // Keep FAB visibility in sync
      updateFabVisibility();
      document.addEventListener('scroll', updateFabVisibility, {passive:true});
      window.addEventListener('resize', updateFabVisibility);

      // Start on the hero section at load
      goTo('#hero');
    })(); */