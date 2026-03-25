
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackendApiService, IPAQResultPayload } from '../../services/backend-api.service';

/** Respuesta individual de cada pregunta del cuestionario IPAQ. */
interface IPAQResponse {
  days: number;
  hours: number;
  minutes: number;
}

/** Estructura completa del formulario IPAQ en memoria. */
interface IPAQData {
  // Actividad física vigorosa en el trabajo
  workVigorous: IPAQResponse;
  // Actividad física moderada en el trabajo
  workModerate: IPAQResponse;
  // Caminar en el trabajo
  workWalking: IPAQResponse;
  // Actividad física vigorosa en el transporte
  transportVigorous: IPAQResponse;
  // Actividad física moderada en el transporte
  transportModerate: IPAQResponse;
  // Caminar en el transporte
  transportWalking: IPAQResponse;
  // Actividad física vigorosa en tareas domésticas
  houseVigorous: IPAQResponse;
  // Actividad física moderada en tareas domésticas
  houseModerate: IPAQResponse;
  // Caminar en tareas domésticas
  houseWalking: IPAQResponse;
  // Actividad física vigorosa en tiempo libre
  leisureVigorous: IPAQResponse;
  // Actividad física moderada en tiempo libre
  leisureModerate: IPAQResponse;
  // Caminar en tiempo libre
  leisureWalking: IPAQResponse;
  // Tiempo sentado
  sitting: IPAQResponse;
}

/**
 * Página del cuestionario IPAQ.
 *
 * Aquí el usuario responde preguntas de actividad física, el sistema
 * calcula MET-minutos y después guarda el resultado localmente y en backend.
 */
@Component({
  selector: 'app-ipaq',
  templateUrl: 'ipaq.page.html',
  styleUrls: ['ipaq.page.scss'],
  standalone: false,
})
export class IPAQPage implements OnInit {
  /** Paso actual del flujo visual. */
  currentStep: 'intro' | 'questionnaire' | 'results' = 'intro';
  /** Índice de la sección actual. */
  currentSection = 0;
  /** Respuestas acumuladas del cuestionario. */
  ipaqData: Partial<IPAQData> = {};

  /** Definición de secciones y preguntas visibles en pantalla. */
  sections = [
    {
      title: 'Actividad Física General',
      description: 'Preguntas sobre tu actividad física en la última semana',
      questions: [
        { key: 'leisureVigorous', label: 'Actividad física vigorosa', description: 'Actividades que requieren esfuerzo físico intenso (ej: correr, nadar rápido, ciclismo rápido, deportes competitivos, levantar objetos pesados)' },
        { key: 'leisureModerate', label: 'Actividad física moderada', description: 'Actividades que requieren esfuerzo físico moderado (ej: caminar rápido, ciclismo ligero, natación recreativa, jardinería, limpieza)' },
        { key: 'leisureWalking', label: 'Caminar', description: 'Caminar a paso normal (incluye caminar en trabajo, transporte, casa y tiempo libre)' }
      ]
    },
    {
      title: 'Tiempo Sentado',
      description: 'Preguntas sobre el tiempo que pasas sentado',
      questions: [
        { key: 'sitting', label: 'Tiempo sentado', description: 'Tiempo total que pasas sentado en un día típico (incluye trabajo, transporte, casa, tiempo libre)' }
      ]
    }
  ];

  currentQuestionIndex = 0;
  currentQuestion: any = null;

  constructor(private router: Router, private api: BackendApiService) {}

  /** Inicializa el formulario en memoria. */
  ngOnInit() {
    this.initializeData();
  }

  /** Crea la estructura base para cada pregunta. */
  initializeData() {
    this.sections.forEach(section => {
      section.questions.forEach(question => {
        this.ipaqData[question.key as keyof IPAQData] = { days: 0, hours: 0, minutes: 0 };
      });
    });
  }

  /** Inicia el cuestionario desde la introducción. */
  startQuestionnaire() {
    this.currentStep = 'questionnaire';
    this.currentSection = 0;
    this.currentQuestionIndex = 0;
    this.loadCurrentQuestion();
  }

  /** Carga la pregunta actual y asegura su objeto de respuesta. */
  loadCurrentQuestion() {
    const section = this.sections[this.currentSection];
    this.currentQuestion = section.questions[this.currentQuestionIndex];
    // Asegurar que existe la entrada en ipaqData
    if (!this.ipaqData[this.currentQuestion.key as keyof IPAQData]) {
      this.ipaqData[this.currentQuestion.key as keyof IPAQData] = { days: 0, hours: 0, minutes: 0 };
    }
  }

  /** Avanza a la siguiente pregunta o calcula resultados al terminar. */
  nextQuestion() {
    const section = this.sections[this.currentSection];

    if (this.currentQuestionIndex < section.questions.length - 1) {
      this.currentQuestionIndex++;
      this.loadCurrentQuestion();
    } else if (this.currentSection < this.sections.length - 1) {
      this.currentSection++;
      this.currentQuestionIndex = 0;
      this.loadCurrentQuestion();
    } else {
      this.calculateResults();
    }
  }

  /** Regresa a la pregunta anterior dentro del flujo. */
  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.loadCurrentQuestion();
    } else if (this.currentSection > 0) {
      this.currentSection--;
      const section = this.sections[this.currentSection];
      this.currentQuestionIndex = section.questions.length - 1;
      this.loadCurrentQuestion();
    }
  }

  /** Calcula el porcentaje de avance del cuestionario. */
  getProgress(): number {
    let totalQuestions = 0;
    let answeredQuestions = 0;

    this.sections.forEach(section => {
      section.questions.forEach(question => {
        totalQuestions++;
        const data = this.ipaqData[question.key as keyof IPAQData];
        if (data && (data.days > 0 || data.hours > 0 || data.minutes > 0)) {
          answeredQuestions++;
        }
      });
    });

    return totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;
  }

  /** Calcula MET-minutos y categoría IPAQ a partir de las respuestas. */
  calculateResults() {
    // Calcular MET-minutos/semana según la metodología IPAQ
    let totalMETMinutes = 0;
    let vigorousMETMinutes = 0;
    let moderateMETMinutes = 0;
    let walkingMETMinutes = 0;

    // Valores MET según IPAQ
    const MET_VIGOROUS = 8.0;
    const MET_MODERATE = 4.0;
    const MET_WALKING = 3.3;

    // Calcular para cada categoría (solo las preguntas que tenemos ahora)
    const data = this.ipaqData.leisureVigorous;
    if (data) {
      const totalMinutes = (data.days * ((data.hours * 60) + data.minutes));
      vigorousMETMinutes = totalMinutes * MET_VIGOROUS;
    }

    const moderateData = this.ipaqData.leisureModerate;
    if (moderateData) {
      const totalMinutes = (moderateData.days * ((moderateData.hours * 60) + moderateData.minutes));
      moderateMETMinutes = totalMinutes * MET_MODERATE;
    }

    const walkingData = this.ipaqData.leisureWalking;
    if (walkingData) {
      const totalMinutes = (walkingData.days * ((walkingData.hours * 60) + walkingData.minutes));
      walkingMETMinutes = totalMinutes * MET_WALKING;
    }

    totalMETMinutes = vigorousMETMinutes + moderateMETMinutes + walkingMETMinutes;

    // Clasificación según IPAQ
    let category: 'Bajo' | 'Moderado' | 'Alto' = 'Bajo';
    if (totalMETMinutes >= 3000 || (vigorousMETMinutes >= 1500 && totalMETMinutes >= 3000)) {
      category = 'Alto';
    } else if (vigorousMETMinutes >= 600 || (moderateMETMinutes + walkingMETMinutes >= 1500) || totalMETMinutes >= 3000) {
      category = 'Moderado';
    }

    // Guardar resultados y mostrar
    const results: IPAQResultPayload = {
      totalMETMinutes: Math.round(totalMETMinutes),
      vigorousMETMinutes: Math.round(vigorousMETMinutes),
      moderateMETMinutes: Math.round(moderateMETMinutes),
      walkingMETMinutes: Math.round(walkingMETMinutes),
      category,
      sittingMinutes: this.calculateSittingMinutes(),
    };

    // Guardar local y sincronizar con backend
    localStorage.setItem('ipaqResults', JSON.stringify(results));
    this.api.submitIPAQ({ ...results, answers: this.ipaqData }).subscribe({ error: () => {} });
    this.currentStep = 'results';
  }

  /** Convierte el tiempo sentado a minutos totales. */
  calculateSittingMinutes(): number {
    const sitting = this.ipaqData.sitting;
    if (sitting) {
      return sitting.days * ((sitting.hours * 60) + sitting.minutes);
    }
    return 0;
  }

  /** Recupera los resultados guardados en localStorage. */
  getResults() {
    const results = localStorage.getItem('ipaqResults');
    return results ? JSON.parse(results) : null;
  }

  /** Reinicia el formulario y regresa a la introducción. */
  restartQuestionnaire() {
    this.currentStep = 'intro';
    this.currentSection = 0;
    this.currentQuestionIndex = 0;
    this.initializeData();
  }

  /** Navega a la pantalla principal de la app. */
  goToApp() {
    this.router.navigate(['/home']);
  }

  /** Abre artículos recomendados según el resultado IPAQ. */
  goToRecommendedArticles() {
    const results = this.getResults();
    if (results) {
      this.router.navigate(['/articles', results.category.toLowerCase()]);
    } else {
      this.router.navigate(['/articles']);
    }
  }

  /** Abre la pantalla de rutina recomendada. */
  goToRoutine() {
    this.router.navigate(['/routine']);
  }

  /**
   * Obtiene el valor actual del campo solicitado para la pregunta activa.
   * @param field Campo del bloque IPAQ a consultar.
   */
  getQuestionData(field: 'days' | 'hours' | 'minutes'): number {
    if (!this.currentQuestion) return 0;
    const data = this.ipaqData[this.currentQuestion.key as keyof IPAQData];
    return data ? data[field] : 0;
  }

  setQuestionData(field: 'days' | 'hours' | 'minutes', event: any) {
    if (!this.currentQuestion) return;
    const value = parseInt(event.detail.value) || 0;
    const key = this.currentQuestion.key as keyof IPAQData;
    if (!this.ipaqData[key]) {
      this.ipaqData[key] = { days: 0, hours: 0, minutes: 0 };
    }
    if (this.ipaqData[key]) {
      this.ipaqData[key]![field] = value;
    }
  }
}

