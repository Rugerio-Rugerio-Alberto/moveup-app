

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendApiService } from '../../services/backend-api.service';

interface Habit {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'movimiento' | 'pausas' | 'ejercicio' | 'bienestar';
  difficulty: 'facil' | 'medio' | 'avanzado';
  timeMinutes: number;
}

interface DayProgress {
  date: string;
  dayName: string;
  habitsCompleted: string[];
  isComplete: boolean;
}

@Component({
  selector: 'app-routine',
  templateUrl: 'routine.page.html',
  styleUrls: ['routine.page.scss'],
  standalone: false,
})
export class RoutinePage implements OnInit {
  nivelActividad: 'alto' | 'medio' | 'bajo' | null = null;
  currentWeek: DayProgress[] = [];
  habits: Habit[] = [];
  selectedDate: string = '';
  totalDaysCompleted: number = 0;
  currentWeekNumber: number = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: BackendApiService
  ) {}

  async ngOnInit() {
    // Obtener nivel de actividad del resultado del IPAQ
    const ipaqResults = localStorage.getItem('ipaqResults');
    if (ipaqResults) {
      const results = JSON.parse(ipaqResults);
      this.nivelActividad = results.category.toLowerCase() as 'alto' | 'medio' | 'bajo';
    }

    // Si no hay resultados, usar nivel medio por defecto
    if (!this.nivelActividad) {
      this.nivelActividad = 'medio';
    }

    this.generateHabits();
    this.initializeWeek();
    await this.loadProgress();
  }

  generateHabits() {
    const baseHabits: Habit[] = [
      {
        id: 'walk-30',
        title: 'Caminar 30 minutos',
        description: 'Camina al menos 30 minutos a paso moderado',
        icon: 'walk-outline',
        category: 'movimiento',
        difficulty: 'facil',
        timeMinutes: 30
      },
      {
        id: 'stand-hourly',
        title: 'Levantarse cada hora',
        description: 'Levántate y camina 2-3 minutos cada hora de trabajo',
        icon: 'time-outline',
        category: 'pausas',
        difficulty: 'facil',
        timeMinutes: 2
      },
      {
        id: 'stairs',
        title: 'Usar escaleras',
        description: 'Usa las escaleras en lugar del ascensor',
        icon: 'stairs-outline',
        category: 'movimiento',
        difficulty: 'facil',
        timeMinutes: 5
      },
      {
        id: 'stretch',
        title: 'Estiramientos',
        description: 'Realiza 10 minutos de estiramientos',
        icon: 'fitness-outline',
        category: 'ejercicio',
        difficulty: 'facil',
        timeMinutes: 10
      },
      {
        id: 'water',
        title: 'Hidratación activa',
        description: 'Bebe agua y aprovecha para caminar al baño',
        icon: 'water-outline',
        category: 'bienestar',
        difficulty: 'facil',
        timeMinutes: 1
      }
    ];

    const mediumHabits: Habit[] = [
      {
        id: 'walk-45',
        title: 'Caminar 45 minutos',
        description: 'Camina 45 minutos a paso rápido',
        icon: 'walk-outline',
        category: 'movimiento',
        difficulty: 'medio',
        timeMinutes: 45
      },
      {
        id: 'active-break',
        title: 'Pausa activa de 10 min',
        description: 'Realiza una pausa activa guiada de 10 minutos',
        icon: 'play-circle-outline',
        category: 'pausas',
        difficulty: 'medio',
        timeMinutes: 10
      },
      {
        id: 'strength',
        title: 'Ejercicios de fuerza',
        description: '15 minutos de ejercicios de fuerza (sentadillas, flexiones)',
        icon: 'barbell-outline',
        category: 'ejercicio',
        difficulty: 'medio',
        timeMinutes: 15
      }
    ];

    const advancedHabits: Habit[] = [
      {
        id: 'run-30',
        title: 'Correr 30 minutos',
        description: 'Corre o trota durante 30 minutos',
        icon: 'bicycle-outline',
        category: 'ejercicio',
        difficulty: 'avanzado',
        timeMinutes: 30
      },
      {
        id: 'workout-45',
        title: 'Entrenamiento completo',
        description: 'Entrenamiento de 45 minutos (cardio + fuerza)',
        icon: 'fitness-outline',
        category: 'ejercicio',
        difficulty: 'avanzado',
        timeMinutes: 45
      }
    ];

    // Seleccionar hábitos según el nivel
    if (this.nivelActividad === 'bajo') {
      this.habits = baseHabits;
    } else if (this.nivelActividad === 'medio') {
      this.habits = [...baseHabits, ...mediumHabits.slice(0, 2)];
    } else {
      this.habits = [...baseHabits, ...mediumHabits, ...advancedHabits.slice(0, 1)];
    }
  }

  initializeWeek() {
    const today = new Date();
    const currentDay = today.getDay(); // 0 = Domingo, 1 = Lunes, etc.
    const startOfWeek = new Date(today);
    // Ajustar para que la semana comience en lunes (1)
    const dayOffset = currentDay === 0 ? -6 : 1 - currentDay;
    startOfWeek.setDate(today.getDate() + dayOffset);
    startOfWeek.setHours(0, 0, 0, 0);

    const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    this.currentWeek = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dateString = date.toISOString().split('T')[0];

      this.currentWeek.push({
        date: dateString,
        dayName: daysOfWeek[date.getDay()],
        habitsCompleted: [],
        isComplete: false
      });
    }

    // Seleccionar el día actual por defecto
    const todayString = today.toISOString().split('T')[0];
    // Si el día actual no está en la semana, seleccionar el primer día
    const dayExists = this.currentWeek.find(d => d.date === todayString);
    this.selectedDate = dayExists ? todayString : this.currentWeek[0].date;
  }

  async loadProgress() {
    try {
      const rows = await this.api.getRoutineProgressAsync();
      const allProgress = rows.reduce((acc: any, item: any) => { acc[item.date] = item; return acc; }, {} as any);

      this.currentWeek.forEach(day => {
        const dayProgress = allProgress[day.date];
        if (dayProgress) {
          day.habitsCompleted = Array.isArray(dayProgress.habitsCompleted)
            ? dayProgress.habitsCompleted
            : [];
          // Convertir isComplete a boolean (puede ser number 0/1 o boolean)
          const isCompleteValue = dayProgress.isComplete;
          day.isComplete = isCompleteValue === 1 || isCompleteValue === true;
        } else {
          day.habitsCompleted = [];
          day.isComplete = false;
        }
      });

      await this.calculateTotalDaysCompleted();
    } catch (error) {
      console.error('Error al cargar progreso:', error);
    }
  }

  async saveProgress() {
    try {
      await this.api.saveRoutineProgressAsync(this.currentWeek.map(day => ({
        date: day.date,
        habitsCompleted: day.habitsCompleted,
        isComplete: day.isComplete
      })));
      await this.calculateTotalDaysCompleted();
    } catch (error) {
      console.error('Error al guardar progreso:', error);
    }
  }

  async toggleHabit(habitId: string, date: string) {
    const day = this.currentWeek.find(d => d.date === date);
    if (!day) return;

    const index = day.habitsCompleted.indexOf(habitId);
    if (index > -1) {
      day.habitsCompleted.splice(index, 1);
    } else {
      day.habitsCompleted.push(habitId);
    }

    // Verificar si el día está completo
    day.isComplete = day.habitsCompleted.length === this.habits.length;
    await this.saveProgress();
  }

  isHabitCompleted(habitId: string, date: string): boolean {
    const day = this.currentWeek.find(d => d.date === date);
    return day ? day.habitsCompleted.includes(habitId) : false;
  }

  getCompletedHabitsCount(date: string): number {
    const day = this.currentWeek.find(d => d.date === date);
    return day ? day.habitsCompleted.length : 0;
  }

  getProgressPercentage(date: string): number {
    if (this.habits.length === 0) return 0;
    return (this.getCompletedHabitsCount(date) / this.habits.length) * 100;
  }

  async calculateTotalDaysCompleted() {
    try {
      // Contar días completados de la semana actual
      this.totalDaysCompleted = this.currentWeek.filter(day => day.isComplete).length;

    } catch (error) {
      console.error('Error al calcular días completados:', error);
      this.totalDaysCompleted = this.currentWeek.filter(day => day.isComplete).length;
    }
  }

  getWeekRange(): string {
    if (this.currentWeek.length === 0) return '';
    const start = new Date(this.currentWeek[0].date);
    const end = new Date(this.currentWeek[6].date);
    return `${start.getDate()}/${start.getMonth() + 1} - ${end.getDate()}/${end.getMonth() + 1}`;
  }

  getMotivationalMessage(): string {
    const percentage = (this.totalDaysCompleted / 7) * 100;
    if (percentage === 100) {
      return '¡Semana perfecta! Sigue así.';
    } else if (percentage >= 70) {
      return '¡Excelente progreso! Estás muy cerca.';
    } else if (percentage >= 50) {
      return 'Vas por buen camino, continúa.';
    } else if (percentage >= 30) {
      return 'Cada día cuenta, sigue adelante.';
    } else {
      return 'Comienza hoy, cada paso importa.';
    }
  }

  goToIPAQ() {
    this.router.navigate(['/ipaq']);
  }

  onDateChange(event: CustomEvent) {
    const value = event.detail.value;
    if (typeof value === 'string') {
      this.selectedDate = value;
    } else {
      this.selectedDate = String(value);
    }
  }
}

