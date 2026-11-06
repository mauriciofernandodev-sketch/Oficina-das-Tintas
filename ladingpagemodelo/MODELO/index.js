(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---- orçamento do rodapé: abre o WhatsApp com a mensagem ---- */
    const quoteForm = document.getElementById('quote-form');
    if (quoteForm) {
        quoteForm.addEventListener('submit', event => {
            event.preventDefault();
            const input = document.getElementById('quote-input');
            const wanted = input.value.trim();
            if (!wanted) return;
            const text = `Olá, vim pelo site e gostaria de um orçamento: ${wanted}`;
            window.open(`https://wa.me/5565999768600?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
            input.value = '';
        });
    }

    /* ---- ano no rodapé ---- */
    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();

    /* ---- índice das estrelas (para animar em sequência) ---- */
    document.querySelectorAll('.stars').forEach(group => {
        group.querySelectorAll('i').forEach((star, i) => star.style.setProperty('--i', i));
    });

    /* ---- revelar ao rolar ---- */
    const revealEls = document.querySelectorAll('[data-reveal], .cta, .footer');
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-in');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
        revealEls.forEach(el => revealObserver.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add('is-in'));
    }

    /* ---- barra de progresso + botão flutuante ---- */
    const progress = document.getElementById('progress');
    const fab = document.getElementById('fab');
    let ticking = false;

    const onScroll = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const ratio = max > 0 ? window.scrollY / max : 0;
        if (progress) progress.style.transform = `scaleX(${ratio})`;
        if (fab) fab.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
        ticking = false;
    };
    window.addEventListener('scroll', () => {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(onScroll);
        }
    }, { passive: true });
    onScroll();

    /* ---- link ativo na navegação ---- */
    const links = [...document.querySelectorAll('.nav__links .pill')];
    const sections = links
        .map(link => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    if ('IntersectionObserver' in window) {
        const navObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                links.forEach(link => {
                    link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`);
                });
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        sections.forEach(section => navObserver.observe(section));
    }

    /* ---- parallax suave dos adesivos no hero ---- */
    const hero = document.getElementById('hero');
    const canHover = window.matchMedia('(hover: hover)').matches;

    if (hero && canHover && !reduced) {
        const stickers = hero.querySelectorAll('.sticker[data-depth]');

        hero.addEventListener('mousemove', event => {
            const rect = hero.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;
            stickers.forEach(sticker => {
                const depth = Number(sticker.dataset.depth) || 20;
                sticker.style.setProperty('--px', `${x * depth}px`);
                sticker.style.setProperty('--py', `${y * depth}px`);
            });
        });

        hero.addEventListener('mouseleave', () => {
            stickers.forEach(sticker => {
                sticker.style.setProperty('--px', '0px');
                sticker.style.setProperty('--py', '0px');
            });
        });
    }
})();