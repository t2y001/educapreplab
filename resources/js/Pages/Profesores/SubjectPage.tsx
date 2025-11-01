import { useEffect, useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { ArrowLeft, ChevronLeft, ChevronRight, BookOpen, FileText, Clock, Target, RotateCcw } from "lucide-react";
import {CheckCircle2, Timer, TrendingUp} from "lucide-react";

// UI (shadcn/ui). Ajusta import paths si usas otros componentes UI.
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Card } from "@/Components/ui/card";
import { Progress } from "@/Components/ui/progress";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/Components/ui/tooltip";


// Tus componentes
import { ContentBlocks } from "@/Components/ContentBlocks";
import { ChoicesList } from "@/Components/ChoicesList";

import type {PageProps as InertiaPageProps} from "@inertiajs/core";

import { route } from 'ziggy-js';


// ================== Tipos ==================
type Block = any; // (ya lo tipaste dentro de ContentBlocks)
type ChoiceDTO = { label: 'A'|'B'|'C'; content_json: Block[] };

type ProblemStats = {
  avg_time_sec: number | null;               // segundos promedio
  correct_rate: number | null;               // 0..1
  attempts: number;                          // n° intentos comunidad
  community_difficulty: 'fácil'|'media'|'difícil'|null;
};

type ProblemDTO = {
  id: number;
  answer_key: 'A'|'B'|'C';
  stimulus_blocks: Block[];
  item_blocks: Block[];
  choices: ChoiceDTO[];
  solution?: { explanation_json: Block[]; misconception_json?: Block[]; visibility?: 'inherit'|'public'|'subscribers'|'private' };
  stimulus_author?: string | null;
  stats?: ProblemStats;
  difficulty?: 'fácil'|'media'|'difícil'; // (si quieres mostrar la dificultad oficial además de la comunitaria)
  skill?: string;
};

type Subtopic = { id:number; nombre:string; nombreCorto?:string; slug?:string };
type Eje = { id:number; nombre:string; nombreCorto?:string; slug?:string; subtemas:Subtopic[] };
type Topic = { id:number; nombre:string; nombreCorto?:string; slug?:string; ejes:Eje[]; standaloneSubtopics:Subtopic[] };

type SubjectDTO = { slug:string; title:string; audienciaId:number; audiencia:string; descripcion:string; problemCount:number };

interface AppPageProps extends InertiaPageProps{
  subject: SubjectDTO;
  topics: Topic[];
  problems: ProblemDTO[];
  pagination: { page:number; perPage:number; total:number; hasMore:boolean };
  activeFilters: { tema_id:number|null; eje_id:number|null; subtema_id:number|null; mode:'temas'|'random'|'random_adaptive' };
  // En muchos stacks Inertia/Laravel se comparte el usuario en props.auth.user
  auth?: { user?: { id:number; name:string; isSubscriber?: boolean } };
  user?: { id:number; name:string; isSubscriber?: boolean }; // fallback por si lo compartes así
}

// ================== Página ==================
export default function SubjectPage() {
  const { props } = usePage<AppPageProps>();
  const { subject, topics, problems, pagination, activeFilters } = props;

  // Subscripción: intenta leer de auth.user o user plano
  const isSubscriber = Boolean(props.auth?.user?.isSubscriber ?? props.user?.isSubscriber ?? false);

  // Modo: 'temas' | 'random' | 'random_adaptive'
  const [mode, setMode] = useState<'temas'|'random'|'random_adaptive'>(activeFilters.mode ?? 'temas');

  // Selección actual (por IDs)
  const [selectedTopic, setSelectedTopic] = useState<number | null>(activeFilters.tema_id ?? null);
  const [selectedEjeId, setSelectedEjeId] = useState<number | null>(activeFilters.eje_id ?? null);
  const [selectedSubtopic, setSelectedSubtopic] = useState<number | null>(activeFilters.subtema_id ?? null);

  // Expansión de filas (UX: chevrons)
  const [expandedTopics, setExpandedTopics] = useState<Record<number, boolean>>({});
  const [expandedEjes, setExpandedEjes] = useState<Record<number, boolean>>({});

  // Modal upsell (suscripción)
  const [showUpsell, setShowUpsell] = useState(false);

  // Estado del problema actual en el batch
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentProblem = problems[currentIndex] || null;
  const progress = problems.length > 0 ? ((currentIndex + 1) / problems.length) * 100 : 0;
  const questionNumber = ((pagination.page-1) * pagination.perPage) + (currentIndex + 1);


  // Interacción
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timer, setTimer] = useState(0);
  const [attempts, setAttempts] = useState(0);

  // ===== Helpers =====
  const toggleTopic = (topicId: number) =>
    setExpandedTopics((s) => ({ ...s, [topicId]: !s[topicId] }));
  const toggleEje = (ejeId: number) =>
    setExpandedEjes((s) => ({ ...s, [ejeId]: !s[ejeId] }));

  const topicById = (id?: number|null) => topics.find(t => t.id === id!);
  const ejeById = (topicId?: number|null, ejeId?: number|null) =>
    topicById(topicId)?.ejes.find(e => e.id === ejeId!);
  const subtemaName = (topicId?: number|null, ejeId?: number|null, subId?: number|null) => {
    if (!subId) return null;
    if (ejeId) {
      return ejeById(topicId, ejeId)?.subtemas.find(s => s.id === subId)?.nombreCorto
        || ejeById(topicId, ejeId)?.subtemas.find(s => s.id === subId)?.nombre;
    }
    return topicById(topicId)?.standaloneSubtopics.find(s => s.id === subId)?.nombreCorto
      || topicById(topicId)?.standaloneSubtopics.find(s => s.id === subId)?.nombre;
  };

  const topicName = selectedTopic ? (topicById(selectedTopic)?.nombreCorto || topicById(selectedTopic)?.nombre) : null;
  const ejeName   = selectedEjeId ? (ejeById(selectedTopic, selectedEjeId)?.nombreCorto || ejeById(selectedTopic, selectedEjeId)?.nombre) : null;
  const subName   = subtemaName(selectedTopic, selectedEjeId, selectedSubtopic);


  // Navegar con filtros (Inertia GET). Mantiene estado/scroll.
  const applyFilters = (overrides: Partial<{ tema_id:number|null; eje_id:number|null; subtema_id:number|null; mode:'temas'|'random'|'random_adaptive'; page:number; per_page:number }>) => {
    const q = {
      tema_id: overrides.tema_id ?? selectedTopic,
      eje_id: overrides.eje_id ?? selectedEjeId,
      subtema_id: overrides.subtema_id ?? selectedSubtopic,
      mode: overrides.mode ?? mode,
      page: overrides.page ?? 1,
      per_page: overrides.per_page ?? undefined,
    };
    router.get(window.location.pathname, q, { preserveState: true, preserveScroll: true, replace: true });
  };

  // Timer general
  useEffect(() => {
    const t = setInterval(() => setTimer((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // Reset de selección de respuesta al cambiar de problema
  useEffect(() => {
    setSelectedAnswer(null);
    setShowExplanation(false);
  }, [currentIndex]);

  // Reset cuando cambia el dataset (por cambio de filtros/mode)
  useEffect(() => {
    setCurrentIndex(0);
  }, [problems]);

  // Reset completo cuando cambia el área/página
  useEffect(() => {
    const nt = activeFilters.tema_id ?? null;
    const ne = activeFilters.eje_id ?? null;
    const ns = activeFilters.subtema_id ?? null;
    const nm = activeFilters.mode ?? 'temas';

    setSelectedTopic(nt);
    setSelectedEjeId(ne);
    setSelectedSubtopic(ns);
    setMode(nm);

    setExpandedTopics(prev => (nt ? {...prev, [nt]: true} : prev));
    setExpandedEjes(prev => (ne ? {...prev, [ne]: true} : prev));
  }, [activeFilters.tema_id, activeFilters.eje_id, activeFilters.subtema_id, activeFilters.mode, subject.slug]);

  // ================== Render ==================
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Topbar */}
      <nav className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/profesores">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver
                </Button>
              </Link>
              <h1 className="text-xl font-semibold">{subject.title}</h1>
            </div>

            {/* Modos */}
            <div className="flex items-center gap-2 border rounded-lg p-1">
              <Button
                size="sm"
                variant={mode === "temas" ? "default" : "ghost"}
                onClick={() => {
                  setMode("temas");
                  applyFilters({ mode: 'temas', page: 1 });
                }}
                className="text-xs"
              >
                Por temas
              </Button>

              <Button
                size="sm"
                variant={mode.startsWith("random") ? "default" : "ghost"}
                onClick={() => {
                  const next = isSubscriber ? 'random_adaptive' : 'random';
                  setMode(next);
                  // En aleatorio conviene traer nuevo batch
                  applyFilters({ mode: next, page: 1 });
                }}
                className="text-xs"
              >
                Aleatorio{isSubscriber ? " (adaptativo)" : ""}
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  if (!isSubscriber) { setShowUpsell(true); return; }
                  router.visit('/simulacros');
                }}
                className="text-xs"
              >
                Simulacros
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex">
        {/* SIDEBAR */}
        <aside className={`w-80 border-r border-border bg-card overflow-y-auto ${mode.startsWith('random') ? 'opacity-50 pointer-events-none select-none' : ''}`}>
          <div className="p-4 border-b">
            <button
              onClick={() => {
                setSelectedTopic(null);
                setSelectedEjeId(null);
                setSelectedSubtopic(null);
                setCurrentIndex(0);
                applyFilters({ tema_id: null, eje_id: null, subtema_id: null, page: 1 });
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedTopic === null && selectedEjeId === null && selectedSubtopic === null
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-accent"
              }`}
            >
              Todos los temas
            </button>
          </div>

          <div className="p-4">
            <ul className="space-y-2">
              {topics.map((topic) => {
                const isTopicExpanded = !!expandedTopics[topic.id];
                const isTopicSelected = selectedTopic === topic.id && !selectedEjeId && !selectedSubtopic;

                return (
                  <li key={topic.id} className="border-b last:border-b-0 pb-2">
                    <div className="flex items-center">
                      {/* Seleccionar tema (texto) */}
                      <button
                        onClick={() => {
                          setSelectedTopic(topic.id);
                          setSelectedEjeId(null);
                          setSelectedSubtopic(null);
                          setCurrentIndex(0);
                          applyFilters({ tema_id: topic.id, eje_id: null, subtema_id: null, page: 1 });
                        }}
                        className={`flex-1 text-left px-3 py-2 rounded-md text-sm transition-colors ${
                          isTopicSelected ? "bg-primary/10 text-primary font-medium" : "text-foreground hover:bg-accent"
                        }`}
                        title="Ver problemas del tema"
                      >
                        {topic.nombreCorto || topic.nombre}
                      </button>

                      {/* Chevron (solo despliega/oculta) */}
                      <button
                        onClick={() => toggleTopic(topic.id)}
                        className="ml-2 p-2 rounded-md hover:bg-accent"
                        aria-label={isTopicExpanded ? "Cerrar" : "Abrir"}
                        title={isTopicExpanded ? "Cerrar" : "Abrir"}
                      >
                        <svg className={`w-4 h-4 transition-transform ${isTopicExpanded ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>

                    {/* Ejes/Subtemas */}
                    {isTopicExpanded && (
                      <div className="mt-2 ml-2 space-y-2">
                        {topic.ejes.length > 0 ? (
                          <>
                            {topic.ejes.map((eje) => {
                              const isEjeExpanded = !!expandedEjes[eje.id];
                              const isEjeSelected = selectedTopic === topic.id && selectedEjeId === eje.id && !selectedSubtopic;

                              return (
                                <div key={eje.id} className="pl-2">
                                  <div className="flex items-center">
                                    {/* Seleccionar eje */}
                                    <button
                                      onClick={() => {
                                        setSelectedTopic(topic.id);
                                        setSelectedEjeId(eje.id);
                                        setSelectedSubtopic(null);
                                        setCurrentIndex(0);
                                        applyFilters({ tema_id: topic.id, eje_id: eje.id, subtema_id: null, page: 1 });
                                      }}
                                      className={`flex-1 text-left px-3 py-2 rounded-md text-sm transition-colors ${
                                        isEjeSelected ? "bg-primary/10 text-primary font-medium" : "text-foreground hover:bg-accent"
                                      }`}
                                      title="Ver problemas del eje"
                                    >
                                      {eje.nombreCorto || eje.nombre}
                                    </button>

                                    {/* Chevron del eje */}
                                    <button
                                      onClick={() => toggleEje(eje.id)}
                                      className="ml-2 p-2 rounded-md hover:bg-accent"
                                      aria-label={isEjeExpanded ? "Cerrar subtemas" : "Abrir subtemas"}
                                      title={isEjeExpanded ? "Cerrar subtemas" : "Abrir subtemas"}
                                    >
                                      <svg className={`w-4 h-4 transition-transform ${isEjeExpanded ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                      </svg>
                                    </button>
                                  </div>

                                  {/* Subtemas del eje */}
                                  {isEjeExpanded && (
                                    <div className="mt-1 ml-4 space-y-1">
                                      {(eje.subtemas ?? []).length === 0 && (
                                        <div className="text-xs text-muted-foreground py-1">(Sin subtemas)</div>
                                      )}
                                      {(eje.subtemas ?? []).map((sub) => (
                                        <button
                                          key={sub.id}
                                          onClick={() => {
                                            setSelectedTopic(topic.id);
                                            setSelectedEjeId(eje.id);
                                            setSelectedSubtopic(sub.id);
                                            setCurrentIndex(0);
                                            applyFilters({ tema_id: topic.id, eje_id: eje.id, subtema_id: sub.id, page: 1 });
                                          }}
                                          className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${
                                            selectedSubtopic === sub.id && selectedEjeId === eje.id
                                              ? "bg-primary/10 text-primary font-medium"
                                              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                          }`}
                                          title="Ver problemas del subtema"
                                        >
                                          {sub.nombreCorto || sub.nombre}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}

                            {/* Subtemas sin eje */}
                            {topic.standaloneSubtopics.length > 0 && (
                              <div className="mt-3">
                                <div className="text-xs uppercase tracking-wide text-muted-foreground px-3 py-1">Subtemas sin eje</div>
                                {(topic.standaloneSubtopics ?? []).map((sub) => (
                                  <button
                                    key={sub.id}
                                    onClick={() => {
                                      setSelectedTopic(topic.id);
                                      setSelectedEjeId(null);
                                      setSelectedSubtopic(sub.id);
                                      setCurrentIndex(0);
                                      applyFilters({ tema_id: topic.id, eje_id: null, subtema_id: sub.id, page: 1 });
                                    }}
                                    className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${
                                      selectedSubtopic === sub.id && selectedEjeId === null
                                        ? "bg-primary/10 text-primary font-medium"
                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                    }`}
                                    title="Ver problemas del subtema"
                                  >
                                    {sub.nombreCorto || sub.nombre}
                                  </button>
                                ))}
                              </div>
                            )}
                          </>
                        ) : (
                          // Tema sin ejes → subtemas planos
                          <div className="pl-2">
                            {(topic.standaloneSubtopics ?? []).length === 0 && (
                              <div className="text-xs text-muted-foreground py-1">(No hay subtemas)</div>
                            )}
                            {(topic.standaloneSubtopics ?? []).map((sub) => (
                              <button
                                key={sub.id}
                                onClick={() => {
                                  setSelectedTopic(topic.id);
                                  setSelectedEjeId(null);
                                  setSelectedSubtopic(sub.id);
                                  setCurrentIndex(0);
                                  applyFilters({ tema_id: topic.id, eje_id: null, subtema_id: sub.id, page: 1 });
                                }}
                                className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${
                                  selectedSubtopic === sub.id
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                }`}
                                title="Ver problemas del subtema"
                              >
                                {sub.nombreCorto || sub.nombre}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        {/* MAIN */}
        <main className="flex-1 overflow-y-auto">
          <div className="container max-w-4xl mx-auto p-6">
            {/* Métricas superiores (comunidad) */}
<TooltipProvider>
  <div className="grid grid-cols-4 gap-4 mb-6">
    {mode === "temas" ? (
      <>
        {/* Dificultad + % éxito */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Card className="p-4 cursor-help">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground">Dificultad</span>
              </div>
              <div className="space-y-2">
                {(() => {
                  const diff = currentProblem?.stats?.community_difficulty; // 'fácil'|'media'|'difícil'|null
                  const pill = diff === 'fácil'
                    ? { cls: "bg-green-500/10 text-green-600 dark:text-green-400", label: "🟢 Fácil" }
                    : diff === 'media'
                    ? { cls: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400", label: "🟡 Medio" }
                    : diff === 'difícil'
                    ? { cls: "bg-red-500/10 text-red-600 dark:text-red-400", label: "🔴 Difícil" }
                    : { cls: "bg-muted text-muted-foreground", label: "—" };
                  return (
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${pill.cls}`}>
                      {pill.label}
                    </div>
                  );
                })()}
                <p className="text-xs text-muted-foreground">
                  {currentProblem?.stats?.correct_rate != null
                    ? `${Math.round(currentProblem.stats.correct_rate * 100)}% de éxito`
                    : "—"}
                </p>
              </div>
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs">
              {currentProblem?.stats?.attempts
                ? `Basado en ${currentProblem.stats.attempts} intentos de la comunidad`
                : "Aún sin datos suficientes"}
            </p>
          </TooltipContent>
        </Tooltip>

        {/* Tasa de éxito */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Card className="p-4 cursor-help">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                <span className="text-xs text-muted-foreground">Tasa de éxito</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {currentProblem?.stats?.correct_rate != null
                  ? `${Math.round(currentProblem.stats.correct_rate * 100)}%`
                  : "—"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">en la comunidad</p>
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs">
              {currentProblem?.stats?.attempts
                ? `Promedio: ${currentProblem.stats.attempts} intentos`
                : "Aún sin datos"}
            </p>
          </TooltipContent>
        </Tooltip>

        {/* Tiempo promedio */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Card className="p-4 cursor-help">
              <div className="flex items-center gap-2 mb-2">
                <Timer className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground">Tiempo promedio</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {currentProblem?.stats?.avg_time_sec != null
                  ? `${Math.floor(currentProblem.stats.avg_time_sec / 60)}:${String(currentProblem.stats.avg_time_sec % 60).padStart(2, "0")}`
                  : "—"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">de la comunidad</p>
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs">
              Este tiempo es el promedio que tarda la comunidad en resolver este problema.
            </p>
          </TooltipContent>
        </Tooltip>

        {/* Competencia (si la tienes en el DTO) */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Card className="p-4 cursor-help">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-secondary" />
                <span className="text-xs text-muted-foreground">Competencia</span>
              </div>
              <p className="text-sm font-semibold text-foreground leading-tight">
                {currentProblem?.skill ?? "—"}
              </p>
            </Card>
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs">
              Este problema mide tu capacidad en esta competencia específica.
            </p>
          </TooltipContent>
        </Tooltip>
      </>
    ) : (
      // Cuando NO es 'temas' (p.ej. random/adaptativo) mantenemos tus cards de progreso
      <>
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Progreso</span>
          </div>
          <div className="space-y-2">
            <Progress value={problems.length ? ((currentIndex + 1) / problems.length) * 100 : 0} className="h-2" />
            <p className="text-sm font-semibold">
              {problems.length ? (currentIndex + 1) : 0} / {problems.length}
            </p>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-accent" />
            <span className="text-xs text-muted-foreground">Puntaje</span>
          </div>
          <p className="text-2xl font-bold text-foreground">—</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <RotateCcw className="w-4 h-4 text-secondary" />
            <span className="text-xs text-muted-foreground">Intentos</span>
          </div>
          <p className="text-2xl font-bold text-foreground">—</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground">Tiempo</span>
          </div>
          <p className="text-2xl font-bold text-foreground">—</p>
        </Card>
      </>
    )}
  </div>
</TooltipProvider>


            {/* Problema */}
            {currentProblem ? (
              <>
                {/* Estímulo */}
                {(currentProblem.stimulus_blocks?.length ?? 0) > 0 ? (
                  <div className="mb-6 p-4 bg-accent/10 rounded-lg border">
                    <div className="text-[12px] leading-[1.65] md:text-[16px] md:leading-[1.4]">
                      <ContentBlocks blocks={currentProblem.stimulus_blocks} />
                    </div>
                    {currentProblem.stimulus_author && (
                      <div className="mt-2 text-xs text-muted-foreground text-right">
                        Autor: {currentProblem.stimulus_author}
                      </div>
                    )}
                  </div>
                ) : currentProblem.stimulus_author ? (
                  <div className="mb-6 text-xs text-muted-foreground text-right">
                    Autor: {currentProblem.stimulus_author}
                  </div>
                ) : null}

                {/* Enunciado */}
                <Card className="p-6 mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    {/*podría eliminar este Badge */}
                    <Badge variant="outline">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="text-xs text-muted-foreground">Filtro:</span>

                        <button
                          className="text-xs px-2 py-1 rounded-full border hover:bg-accent"
                          onClick={() => {
                            setSelectedTopic(null); setSelectedEjeId(null); setSelectedSubtopic(null);
                            applyFilters({ tema_id: null, eje_id: null, subtema_id: null, page: 1 });
                            // opcional: colapsar/expandir sidebar como prefieras
                          }}
                        >
                          General
                        </button>

                        {topicName && (
                          <button
                            className="text-xs px-2 py-1 rounded-full border hover:bg-accent"
                            onClick={() => {
                              setSelectedTopic(selectedTopic); setSelectedEjeId(null); setSelectedSubtopic(null);
                              // abre el tema en el sidebar:
                              setExpandedTopics(s => ({ ...s, [selectedTopic!]: true }));
                              applyFilters({ tema_id: selectedTopic, eje_id: null, subtema_id: null, page: 1 });
                            }}
                          >
                            Tema: {topicName}
                          </button>
                        )}

                        {ejeName && (
                          <button
                            className="text-xs px-2 py-1 rounded-full border hover:bg-accent"
                            onClick={() => {
                              setSelectedEjeId(selectedEjeId); setSelectedSubtopic(null);
                              setExpandedTopics(s => ({ ...s, [selectedTopic!]: true }));
                              setExpandedEjes(s => ({ ...s, [selectedEjeId!]: true }));
                              applyFilters({ tema_id: selectedTopic, eje_id: selectedEjeId, subtema_id: null, page: 1 });
                            }}
                          >
                            Eje: {ejeName}
                          </button>
                        )}

                        {subName && (
                          <span className="text-xs px-2 py-1 rounded-full border bg-accent/30">
                            Subtema: {subName}
                          </span>
                        )}
                      </div>
                    </Badge>
                  </div>

                  <h2 className="text-lg font-semibold mb-4">Pregunta {questionNumber}</h2>
                  <div className = "prose prose-base max-w-none dark:prose-invert">
                    <ContentBlocks blocks={currentProblem.item_blocks} />
                  </div>

                  <div className="mt-6">
                    <ChoicesList
                      choices={currentProblem.choices}
                      selected={selectedAnswer}
                      correct={currentProblem.answer_key}
                      onSelect={(label) => {
                        setSelectedAnswer(label);
                        setAttempts((a) => a + 1);
                        // (opcional) POST /progreso/responder para registrar respuesta/adaptativo
                      }}
                    />
                  </div>

                  {/* Explicación */}
                  <div className="mt-6 flex items-center gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowExplanation((v) => !v)}
                      disabled={!selectedAnswer}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      {showExplanation ? "Ocultar explicación" : "Ver explicación"}
                    </Button>
                  </div>

                  {showExplanation && (
                    <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Explicación oficial</h4>
                        <ContentBlocks blocks={currentProblem.solution?.explanation_json || []} />
                      </div>

                      {currentProblem.solution?.misconception_json && (
                        <div>
                          <h4 className="font-semibold mb-2">Concepción alternativa</h4>
                          <ContentBlocks blocks={currentProblem.solution.misconception_json} />
                        </div>
                      )}
                    </div>
                  )}
                </Card>

                {/* Navegación */}
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                    disabled={currentIndex === 0}
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Anterior
                  </Button>

                  <div className="flex items-center gap-2">
                    {/* Paginación en servidor */}
                    {pagination.page > 1 && (
                      <Button
                        variant="outline"
                        onClick={() => applyFilters({ page: pagination.page - 1 })}
                      >
                        Página {pagination.page - 1}
                      </Button>
                    )}
                    {pagination.hasMore && (
                      <Button
                        variant="outline"
                        onClick={() => applyFilters({ page: pagination.page + 1 })}
                      >
                        Página {pagination.page + 1}
                      </Button>
                    )}
                  </div>

                  <Button
                    onClick={() => {
                      if (currentIndex < problems.length - 1) {
                        setCurrentIndex((i) => i + 1);
                      } else if (pagination.hasMore) {
                        // En aleatorio: pide nuevo batch
                        applyFilters({ page: pagination.page + 1 });
                      }
                    }}
                    disabled={currentIndex >= problems.length - 1 && !pagination.hasMore}
                  >
                    Siguiente
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No hay problemas para este filtro.
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal Upsell (suscripción) */}
      {showUpsell && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          {isSubscriber === false && !props.auth?.user ? (
            // --- Modal para INVITADOS ---
            <div className="bg-card p-6 rounded-xl shadow-xl max-w-sm w-full space-y-4 text-center">
              <h3 className="text-lg font-semibold">Crea una cuenta para continuar</h3>
              <p className="text-sm text-muted-foreground">
                Regístrate gratis para acceder a más funciones y guardar tu progreso.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
                <Button variant="outline" onClick={() => setShowUpsell(false)}>Más tarde</Button>
                <Link href={route('register')} className="w-full sm:w-auto"><Button className="w-full">Registrarse Gratis</Button></Link>
              </div>
            </div>
          ) : (
            // --- Modal para USUARIOS REGISTRADOS (no suscriptores) ---
            <div className="bg-card p-6 rounded-xl shadow-xl max-w-sm w-full space-y-4 text-center">
              <h3 className="text-lg font-semibold">Desbloquea todo el potencial</h3>
              <p className="text-sm text-muted-foreground">
                Accede a todas las soluciones, simulacros ilimitados y modo adaptativo con el plan Premium.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
                <Button variant="outline" onClick={() => setShowUpsell(false)}>Cancelar</Button>
                <Link href={route('subscription.page')} className="w-full sm:w-auto"><Button className="w-full">Ver Planes</Button></Link>
              </div>
            </div>
          )}
        </div>
        
      )}
    </div>
  );
}
