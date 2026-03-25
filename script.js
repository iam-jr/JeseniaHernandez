// ============================================
// SCROLL ANIMATIONS WITH INTERSECTION OBSERVER
// ============================================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with animation classes
    const animatedElements = document.querySelectorAll(
        '.fade-in-up, .fade-in-down, .fade-in-left, .fade-in-right, .fade-in-scale'
    );
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// ============================================
// MENU HAMBURGUESA
// ============================================

function setupMenuToggle() {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Cerrar menú cuando se hace click en un link
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });

        // Cerrar menú cuando se hace click fuera
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar')) {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }
}

// ============================================
// VARIABLES & STATE
// ============================================
let selectedService = null;
let selectedDate = null;
let selectedTime = null;
let currentMonth = new Date();

const businessHours = {
    start: 9,
    end: 18
};

const closedDays = [0, 6]; // 0 = Sunday, 6 = Saturday (Anthropos opens Tue-Sat, but we'll allow weekends for demo)

// ============================================
// CALENDAR FUNCTIONALITY
// ============================================

function initCalendar() {
    renderCalendar();
    setupCalendarNavigation();
}

function renderCalendar() {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // Update header
    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    document.getElementById('monthYear').textContent = `${monthNames[month]} ${year}`;
    
    // Clear calendar
    const calendarDays = document.getElementById('calendarDays');
    calendarDays.innerHTML = '';
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    // Add previous month's days
    for (let i = firstDay - 1; i >= 0; i--) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day other-month';
        dayElement.textContent = daysInPrevMonth - i;
        calendarDays.appendChild(dayElement);
    }
    
    // Add current month's days
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        
        const date = new Date(year, month, day);
        date.setHours(0, 0, 0, 0);
        
        // Disable past dates and Sundays/Mondays (closed days)
        if (date < today || closedDays.includes(date.getDay())) {
            dayElement.classList.add('disabled');
        } else {
            dayElement.addEventListener('click', () => selectDate(date));
        }
        
        // Mark selected date
        if (selectedDate && date.getTime() === selectedDate.getTime()) {
            dayElement.classList.add('selected');
        }
        
        calendarDays.appendChild(dayElement);
    }
    
    // Add next month's days
    const totalCells = calendarDays.children.length;
    const remainingCells = 42 - totalCells; // 6 rows * 7 days
    for (let day = 1; day <= remainingCells; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day other-month';
        dayElement.textContent = day;
        calendarDays.appendChild(dayElement);
    }
}

function setupCalendarNavigation() {
    document.getElementById('prevMonth').addEventListener('click', () => {
        currentMonth.setMonth(currentMonth.getMonth() - 1);
        renderCalendar();
    });
    
    document.getElementById('nextMonth').addEventListener('click', () => {
        currentMonth.setMonth(currentMonth.getMonth() + 1);
        renderCalendar();
    });
}

function selectDate(date) {
    selectedDate = new Date(date);
    selectedTime = null; // Reset time when date changes
    renderCalendar();
    renderTimeSlots();
    updateSummary();
}

// ============================================
// TIME SLOTS FUNCTIONALITY
// ============================================

function renderTimeSlots() {
    const timeSlots = document.getElementById('timeSlots');
    timeSlots.innerHTML = '';
    
    if (!selectedDate) {
        timeSlots.innerHTML = '<p class="empty-message">Selecciona una fecha primero</p>';
        return;
    }
    
    // Generate time slots
    for (let hour = businessHours.start; hour < businessHours.end; hour++) {
        const timeSlot = document.createElement('div');
        timeSlot.className = 'time-slot';
        
        const displayHour = hour > 12 ? hour - 12 : hour;
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const timeString = `${displayHour}:00 ${ampm}`;
        
        timeSlot.textContent = timeString;
        timeSlot.addEventListener('click', () => selectTime(hour, timeString));
        
        if (selectedTime === hour) {
            timeSlot.classList.add('selected');
        }
        
        // Mark some slots as unavailable (random for demo)
        if (Math.random() < 0.2) {
            timeSlot.classList.add('unavailable');
        }
        
        timeSlots.appendChild(timeSlot);
    }
}

function selectTime(hour, timeString) {
    selectedTime = hour;
    renderTimeSlots();
    updateSummary();
}

// ============================================
// SERVICE SELECTION
// ============================================

function setupServiceSelection() {
    const serviceItems = document.querySelectorAll('.service-item');
    
    serviceItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all items
            serviceItems.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked item
            item.classList.add('active');
            
            // Store selected service
            selectedService = {
                name: item.dataset.service,
                price: parseFloat(item.dataset.price)
            };
            
            updateSummary();
        });
    });
}

// ============================================
// SUMMARY UPDATE
// ============================================

function updateSummary() {
    // Service
    const serviceName = selectedService ? selectedService.name : '-';
    document.getElementById('summaryService').textContent = serviceName;
    document.getElementById('selectedService').textContent = serviceName;
    
    // Date
    if (selectedDate) {
        const dateString = selectedDate.toLocaleDateString('es-ES', {
            weekday: 'short',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        document.getElementById('summaryDate').textContent = dateString;
    } else {
        document.getElementById('summaryDate').textContent = '-';
    }
    
    // Time
    if (selectedTime !== null) {
        const displayHour = selectedTime > 12 ? selectedTime - 12 : selectedTime;
        const ampm = selectedTime >= 12 ? 'PM' : 'AM';
        const timeString = `${displayHour}:00 ${ampm}`;
        document.getElementById('summaryTime').textContent = timeString;
    } else {
        document.getElementById('summaryTime').textContent = '-';
    }
    
    // Price
    const priceText = selectedService ? `$${selectedService.price.toFixed(2)}` : '$0.00';
    document.getElementById('summaryPrice').textContent = priceText;
}

// ============================================
// BOOKING CONFIRMATION
// ============================================

function setupConfirmButton() {
    const confirmBtn = document.getElementById('confirmBtn');
    
    confirmBtn.addEventListener('click', () => {
        const name = document.getElementById('clientName').value.trim();
        const email = document.getElementById('clientEmail').value.trim();
        const phone = document.getElementById('clientPhone').value.trim();
        
        // Validation
        if (!selectedService) {
            showMessage('⚠️ Por favor selecciona un servicio', false);
            return;
        }
        
        if (!selectedDate) {
            showMessage('⚠️ Por favor selecciona una fecha', false);
            return;
        }
        
        if (selectedTime === null) {
            showMessage('⚠️ Por favor selecciona una hora', false);
            return;
        }
        
        if (!name) {
            showMessage('⚠️ Por favor ingresa tu nombre', false);
            return;
        }
        
        if (!email) {
            showMessage('⚠️ Por favor ingresa tu email', false);
            return;
        }
        
        if (!phone) {
            showMessage('⚠️ Por favor ingresa tu teléfono', false);
            return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage('⚠️ Por favor ingresa un email válido', false);
            return;
        }
        
        // Create booking object
        const booking = {
            service: selectedService.name,
            price: selectedService.price,
            date: selectedDate.toISOString().split('T')[0],
            time: selectedTime,
            clientName: name,
            clientEmail: email,
            clientPhone: phone,
            bookingTime: new Date().toISOString()
        };
        
        // Save to localStorage
        let bookings = JSON.parse(localStorage.getItem('barberBookings')) || [];
        bookings.push(booking);
        localStorage.setItem('barberBookings', JSON.stringify(bookings));
        
        // Show success message
        const dateString = selectedDate.toLocaleDateString('es-ES', {
            weekday: 'short',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const displayHour = selectedTime > 12 ? selectedTime - 12 : selectedTime;
        const ampm = selectedTime >= 12 ? 'PM' : 'AM';
        
        showMessage(`✅ ¡Cita confirmada para ${dateString} a las ${displayHour}:00 ${ampm}! Se envió confirmación a ${email}`, true);
        
        // Reset form after 3 seconds
        setTimeout(() => {
            resetForm();
        }, 3000);
    });
}

function showMessage(message, isSuccess) {
    const msgElement = document.getElementById('confirmationMsg');
    msgElement.textContent = message;
    msgElement.classList.add('show');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        msgElement.classList.remove('show');
    }, 5000);
}

function resetForm() {
    selectedService = null;
    selectedDate = null;
    selectedTime = null;
    
    document.getElementById('clientName').value = '';
    document.getElementById('clientEmail').value = '';
    document.getElementById('clientPhone').value = '';
    
    const serviceItems = document.querySelectorAll('.service-item');
    serviceItems.forEach(item => item.classList.remove('active'));
    
    updateSummary();
    renderCalendar();
    renderTimeSlots();
    
    const msgElement = document.getElementById('confirmationMsg');
    msgElement.classList.remove('show');
}

// ============================================
// INITIALIZATION
// ============================================

function setupContactForm() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Here you could send the form data to a server
            console.log('Mensaje de contacto enviado');
            
            // Show success message
            alert('¡Gracias por tu mensaje! Te contactaremos pronto.');
            
            // Reset form
            form.reset();
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    setupMenuToggle();
    initCalendar();
    setupServiceSelection();
    setupConfirmButton();
    setupContactForm();
    updateSummary();
    renderTimeSlots();
    setupReviewButton();
});

function setupReviewButton() {
    const addReviewBtn = document.getElementById('addReviewBtn');
    if (addReviewBtn) {
        addReviewBtn.addEventListener('click', () => {
            const reviewModal = document.createElement('div');
            reviewModal.id = 'reviewModal';
            reviewModal.innerHTML = `
                <div class="modal-overlay" id="modalOverlay">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3>Dejar una Opinión</h3>
                            <button class="modal-close" id="closeModalBtn">&times;</button>
                        </div>
                        <form id="reviewForm">
                            <div class="form-group">
                                <label>Tu Nombre</label>
                                <input type="text" id="reviewName" required>
                            </div>
                            <div class="form-group">
                                <label>Tu Email (para verificación)</label>
                                <input type="email" id="reviewEmail" required>
                            </div>
                            <div class="form-group">
                                <label>Foto de Perfil (opcional)</label>
                                <div class="photo-upload-wrapper">
                                    <label for="reviewPhotoFile" class="btn-upload-photo">📷 Subir Foto desde tu Dispositivo</label>
                                    <input type="file" id="reviewPhotoFile" accept="image/*" style="display:none;">
                                    <div id="photoPreview" class="photo-preview"></div>
                                </div>
                                <small>Si no subes foto, se usarán tus iniciales</small>
                            </div>
                            <div class="form-group">
                                <label>Calificación</label>
                                <div class="star-rating" id="starRating">
                                    <span class="star" data-value="1">★</span>
                                    <span class="star" data-value="2">★</span>
                                    <span class="star" data-value="3">★</span>
                                    <span class="star" data-value="4">★</span>
                                    <span class="star" data-value="5">★</span>
                                </div>
                                <input type="hidden" id="ratingValue" value="5" required>
                            </div>
                            <div class="form-group">
                                <label>Tu Opinión</label>
                                <textarea id="reviewText" rows="4" placeholder="Comparte tu experiencia..." required></textarea>
                            </div>
                            <button type="submit" class="btn-submit-review">Enviar Opinión</button>
                        </form>
                    </div>
                </div>
            `;
            
            document.body.appendChild(reviewModal);
            
            // Setup photo upload
            let photoDataUrl = '';
            const photoFileInput = document.getElementById('reviewPhotoFile');
            const photoPreview = document.getElementById('photoPreview');
            photoFileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                        photoDataUrl = ev.target.result;
                        photoPreview.innerHTML = `<img src="${photoDataUrl}" alt="Vista previa" class="photo-preview-img">`;
                    };
                    reader.readAsDataURL(file);
                }
            });

            // Setup star rating
            const stars = document.querySelectorAll('.star');
            const ratingInput = document.getElementById('ratingValue');
            
            stars.forEach(star => {
                star.addEventListener('click', (e) => {
                    const value = e.target.getAttribute('data-value');
                    ratingInput.value = value;
                    
                    stars.forEach(s => {
                        if (s.getAttribute('data-value') <= value) {
                            s.classList.add('active');
                        } else {
                            s.classList.remove('active');
                        }
                    });
                });
                
                star.addEventListener('mouseover', (e) => {
                    const value = e.target.getAttribute('data-value');
                    stars.forEach(s => {
                        if (s.getAttribute('data-value') <= value) {
                            s.style.color = '#d4857c';
                        } else {
                            s.style.color = '#666';
                        }
                    });
                });
            });
            
            document.getElementById('starRating').addEventListener('mouseleave', () => {
                const currentValue = ratingInput.value;
                stars.forEach(s => {
                    if (s.getAttribute('data-value') <= currentValue) {
                        s.style.color = '#d4857c';
                    } else {
                        s.style.color = '#666';
                    }
                });
            });
            
            // Set initial stars to 5
            stars.forEach(s => {
                if (s.getAttribute('data-value') <= 5) {
                    s.classList.add('active');
                }
                s.style.color = '#d4857c';
            });
            
            // Close modal
            document.getElementById('closeModalBtn').addEventListener('click', () => {
                reviewModal.remove();
            });
            
            document.getElementById('modalOverlay').addEventListener('click', (e) => {
                if (e.target === document.getElementById('modalOverlay')) {
                    reviewModal.remove();
                }
            });
            
            // Submit form
            document.getElementById('reviewForm').addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.getElementById('reviewName').value;
                const email = document.getElementById('reviewEmail').value;
                const rating = document.getElementById('ratingValue').value;
                const text = document.getElementById('reviewText').value;
                
                // Generate initials for avatar if no photo provided
                const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
                
                // Create new review card
                const reviewsGrid = document.querySelector('.reviews-grid');
                const newReviewCard = document.createElement('div');
                newReviewCard.className = 'review-card google-review-card fade-in-scale';
                
                const stars = '★'.repeat(parseInt(rating)) + '☆'.repeat(5 - parseInt(rating));
                const today = new Date();
                const dateStr = `Hace ${Math.floor(Math.random() * 7) + 1} días`;
                
                newReviewCard.innerHTML = `
                    <div class="review-header">
                        <div class="reviewer-info">
                            ${photoDataUrl ? 
                                `<img src="${photoDataUrl}" alt="${name}" class="avatar-photo">` : 
                                ''}
                            <div class="avatar" ${photoDataUrl ? 'style="display:none;"' : ''}>${initials}</div>
                            <div>
                                <h4>${name}</h4>
                                <p class="review-date">${dateStr}</p>
                            </div>
                        </div>
                        <div class="stars">${stars}</div>
                    </div>
                    <p class="review-text">${text}</p>
                `;
                
                reviewsGrid.insertBefore(newReviewCard, reviewsGrid.firstChild);
                
                alert('¡Gracias por tu opinión! Tu reseña será revisada y publicada pronto.');
                reviewModal.remove();
            });
        });
    }
}
