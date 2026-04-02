(() => {
	const printBtn = document.getElementById('print-btn');
	const themeToggle = document.getElementById('theme-toggle');
	const dateEl = document.getElementById('cv-date');
	const revealEls = [...document.querySelectorAll('.reveal')];
	const photoWrap = document.querySelector('.photo-wrap');
	const profileImg = photoWrap ? photoWrap.querySelector('img') : null;

	if (dateEl) {
		const now = new Date();
		dateEl.textContent = now.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long'
		});
	}

	if (printBtn) {
		printBtn.addEventListener('click', async () => {
			const cvShell = document.querySelector('.cv-shell');
			if (!cvShell || typeof window.html2canvas !== 'function' || !window.jspdf || !window.jspdf.jsPDF) {
				window.print();
				return;
			}

			const originalLabel = printBtn.textContent;
			printBtn.textContent = 'Generating PDF...';
			printBtn.disabled = true;

			try {
				const canvas = await window.html2canvas(cvShell, {
					scale: 2,
					useCORS: true,
					backgroundColor: '#ffffff'
				});

				const imgData = canvas.toDataURL('image/jpeg', 0.95);
				const pdf = new window.jspdf.jsPDF('p', 'mm', 'a4');
				const pageWidth = pdf.internal.pageSize.getWidth();
				const pageHeight = pdf.internal.pageSize.getHeight();
				const imgWidth = pageWidth;
				const imgHeight = (canvas.height * imgWidth) / canvas.width;

				let remainingHeight = imgHeight;
				let position = 0;

				pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
				remainingHeight -= pageHeight;

				while (remainingHeight > 0) {
					position = remainingHeight - imgHeight;
					pdf.addPage();
					pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
					remainingHeight -= pageHeight;
				}

				pdf.save('Md-Rashed-Mahmud-CV.pdf');
			} catch (error) {
				window.print();
			} finally {
				printBtn.textContent = originalLabel;
				printBtn.disabled = false;
			}
		});
	}

	const savedTheme = localStorage.getItem('cv_theme');
	if (savedTheme === 'dark') {
		document.body.classList.add('dark');
	}

	if (themeToggle) {
		themeToggle.addEventListener('click', () => {
			document.body.classList.toggle('dark');
			localStorage.setItem('cv_theme', document.body.classList.contains('dark') ? 'dark' : 'light');
		});
	}

	if (photoWrap && profileImg) {
		const setPhotoState = () => {
			if (profileImg.complete && profileImg.naturalWidth > 0) {
				photoWrap.classList.remove('empty-photo');
			} else {
				photoWrap.classList.add('empty-photo');
			}
		};

		setPhotoState();
		profileImg.addEventListener('load', setPhotoState);
		profileImg.addEventListener('error', () => {
			photoWrap.classList.add('empty-photo');
		});
	}

	const observer = new IntersectionObserver(
		entries => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					entry.target.classList.add('show');
					observer.unobserve(entry.target);
				}
			});
		},
		{ threshold: 0.14 }
	);

	revealEls.forEach((el, idx) => {
		el.style.transitionDelay = `${Math.min(idx * 60, 260)}ms`;
		observer.observe(el);
	});
})();
