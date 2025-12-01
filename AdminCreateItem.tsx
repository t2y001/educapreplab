import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Shield } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { BlockEditor } from "@/components/BlockEditor";
import { Switch } from "@/components/ui/switch";

const AdminCreateItem = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const { itemId: routeItemId } = useParams();
  const itemId = searchParams.get("id") || routeItemId;
  const isEditMode = !!itemId;
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Data
  const [audiences, setAudiences] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [temas, setTemas] = useState<any[]>([]);
  const [subtemas, setSubtemas] = useState<any[]>([]);
  const [stimuli, setStimuli] = useState<any[]>([]);

  // Form states - Hierarchical filters
  const [audienceId, setAudienceId] = useState<string>("");
  const [areaId, setAreaId] = useState<string>("");
  const [temaId, setTemaId] = useState<string>("");
  const [subtemaId, setSubtemaId] = useState<string>("");
  const [stimulusId, setStimulusId] = useState<string>("");
  const [useStimulus, setUseStimulus] = useState(false);
  const [difficulty, setDifficulty] = useState<string>("medio");
  const [visibility, setVisibility] = useState<string>("free");
  const [explanationVisibility, setExplanationVisibility] = useState<string>("free");
  const [correctAnswer, setCorrectAnswer] = useState<string>("a");
  const [paperType, setPaperType] = useState<string>("none");
  const [isSimilarOnly, setIsSimilarOnly] = useState<boolean>(false);

  // Similar items management
  const [availableSimilarItems, setAvailableSimilarItems] = useState<any[]>([]);
  const [linkedSimilarItems, setLinkedSimilarItems] = useState<any[]>([]);
  const [selectedSimilarItemId, setSelectedSimilarItemId] = useState<string>("");

  // Content blocks
  const [stimulusBlocks, setStimulusBlocks] = useState<any[]>([]);
  const [stimulusTitle, setStimulusTitle] = useState<string>("");
  const [stimulusSource, setStimulusSource] = useState<string>("");
  const [stimulusOrigin, setStimulusOrigin] = useState<string>("");
  const [stimulusCode, setStimulusCode] = useState<string>("");
  const [questionBlocks, setQuestionBlocks] = useState<any[]>([]);
  const [explanationBlocks, setExplanationBlocks] = useState<any[]>([]);
  const [alternativeConceptionBlocks, setAlternativeConceptionBlocks] = useState<any[]>([]);

  // Alternatives
  const [alternatives, setAlternatives] = useState<Record<string, any[]>>({
    a: [],
    b: [],
    c: [],
    d: [],
  });

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast({
            title: "Acceso denegado",
            description: "Debes iniciar sesión",
            variant: "destructive",
          });
          navigate("/auth");
          return;
        }

        const { data: roles, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .eq("role", "admin")
          .maybeSingle();

        if (error) throw error;

        if (!roles) {
          toast({
            title: "Acceso denegado",
            description: "No tienes permisos de administrador",
            variant: "destructive",
          });
          navigate("/dashboard");
          return;
        }

        setIsAdmin(true);
      } catch (error: any) {
        toast({
          title: "Error de autenticación",
          description: error.message,
          variant: "destructive",
        });
        navigate("/dashboard");
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAdminAccess();
  }, [navigate, toast]);

  useEffect(() => {
    if (!isAdmin) return;

    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load audiences
        const { data: audiencesData, error: audiencesError } = await supabase
          .from("audiences")
          .select("*")
          .order("name");

        if (audiencesError) throw audiencesError;
        setAudiences(audiencesData || []);

        // Load all areas
        const { data: areasData, error: areasError } = await supabase
          .from("areas")
          .select("*")
          .order("name");

        if (areasError) throw areasError;
        setAreas(areasData || []);

        // Load all temas
        const { data: temasData, error: temasError } = await supabase
          .from("temas")
          .select("*")
          .order("nombre");

        if (temasError) throw temasError;
        setTemas(temasData || []);

        // Load all subtemas
        const { data: subtemasData, error: subtemasError } = await supabase
          .from("subtemas")
          .select("*")
          .order("name");

        if (subtemasError) throw subtemasError;
        setSubtemas(subtemasData || []);

        // Load stimuli
        const { data: stimuliData, error: stimuliError } = await supabase
          .from("stimuli")
          .select("*")
          .order("created_at", { ascending: false });

        if (stimuliError) throw stimuliError;
        setStimuli(stimuliData || []);

        // Load item data if editing
        if (isEditMode && itemId) {
          const { data: itemData, error: itemError } = await supabase
            .from("items")
            .select("*, stimuli(*)")
            .eq("id", itemId)
            .single();

          if (itemError) throw itemError;

          // Populate form fields
          setSubtemaId(itemData.subtema_id);
          
          // Load hierarchy for edit mode
          if (itemData.subtema_id) {
            const { data: subtemaData } = await supabase
              .from("subtemas")
              .select("tema_id, temas(area_id, areas(audience_id))")
              .eq("id", itemData.subtema_id)
              .single();
            
            if (subtemaData) {
              setTemaId(subtemaData.tema_id || "");
              if (subtemaData.temas) {
                setAreaId((subtemaData.temas as any).area_id || "");
                if ((subtemaData.temas as any).areas) {
                  setAudienceId((subtemaData.temas as any).areas.audience_id || "");
                }
              }
            }
          }
          
          setDifficulty(itemData.difficulty);
          setVisibility(itemData.visibility);
          setExplanationVisibility(itemData.explanation_visibility || "free");
          setCorrectAnswer(itemData.correct_answer);
          setPaperType(itemData.paper_type || "none");
          setIsSimilarOnly(itemData.is_similar_only || false);
          
          // Set question blocks
          if (itemData.question_json && typeof itemData.question_json === 'object' && 'blocks' in itemData.question_json) {
            setQuestionBlocks((itemData.question_json as any).blocks);
          }

          // Set explanation blocks
          if (itemData.explanation_json && typeof itemData.explanation_json === 'object' && 'blocks' in itemData.explanation_json) {
            const explBlocks = (itemData.explanation_json as any).blocks.filter((b: any) => b.type !== "alternative_conception");
            const altConBlocks = (itemData.explanation_json as any).blocks.filter((b: any) => b.type === "alternative_conception");
            setExplanationBlocks(explBlocks);
            // Keep the content but change type to paragraph for editing
            setAlternativeConceptionBlocks(altConBlocks.map((b: any) => ({ 
              type: "paragraph", 
              content: b.content,
              html: b.html
            })));
          }

          // Set stimulus data
          if (itemData.stimulus_id && itemData.stimuli) {
            setUseStimulus(true);
            setStimulusId(itemData.stimulus_id);
            setStimulusTitle(itemData.stimuli.title || "");
            setStimulusSource(itemData.stimuli.source || "");
            setStimulusOrigin(itemData.stimuli.origin || "");
            setStimulusCode(itemData.stimuli.code || "");
            if (itemData.stimuli.content_json && typeof itemData.stimuli.content_json === 'object' && 'blocks' in itemData.stimuli.content_json) {
              setStimulusBlocks((itemData.stimuli.content_json as any).blocks);
            }
          }

          // Load alternatives
          const { data: alternativesData, error: altError } = await supabase
            .from("alternatives")
            .select("*")
            .eq("item_id", itemId)
            .order("order_index");

          if (altError) throw altError;

          const loadedAlternatives: Record<string, any[]> = { a: [], b: [], c: [], d: [] };
          alternativesData?.forEach((alt: any) => {
            if (alt.content_json?.blocks) {
              loadedAlternatives[alt.letter] = alt.content_json.blocks;
            }
          });
          setAlternatives(loadedAlternatives);

          // Load similar items linked to this item
          const { data: similarData, error: similarError } = await supabase
            .from("similar_items")
            .select("*, similar_item:items!similar_items_similar_item_id_fkey(id, question_json, difficulty, subtemas(nombre_corto))")
            .eq("original_item_id", itemId)
            .order("difficulty_order");

          if (similarError) throw similarError;
          setLinkedSimilarItems(similarData || []);
        }

        // Load available similar-only items
        const { data: similarOnlyItems, error: similarOnlyError } = await supabase
          .from("items")
          .select("id, question_json, difficulty, subtemas(nombre_corto)")
          .eq("is_similar_only", true)
          .order("created_at", { ascending: false });

        if (similarOnlyError) throw similarOnlyError;
        setAvailableSimilarItems(similarOnlyItems || []);
      } catch (error: any) {
        toast({
          title: "Error cargando datos",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isAdmin, toast, isEditMode, itemId]);

  // Load stimulus content when a stimulus is selected from dropdown
  useEffect(() => {
    if (!stimulusId || stimulusId === "new") return;

    const loadStimulus = async () => {
      try {
        const { data: stimulusData, error } = await supabase
          .from("stimuli")
          .select("*")
          .eq("id", stimulusId)
          .single();

        if (error) throw error;

        if (stimulusData) {
          setStimulusTitle(stimulusData.title || "");
          setStimulusSource(stimulusData.source || "");
          setStimulusOrigin(stimulusData.origin || "");
          setStimulusCode(stimulusData.code || "");
          if (stimulusData.content_json && typeof stimulusData.content_json === 'object' && 'blocks' in stimulusData.content_json) {
            setStimulusBlocks((stimulusData.content_json as any).blocks);
          }
        }
      } catch (error: any) {
        toast({
          title: "Error cargando estímulo",
          description: error.message,
          variant: "destructive",
        });
      }
    };

    loadStimulus();
  }, [stimulusId, toast]);

  const handleSave = async () => {
    if (!subtemaId) {
      toast({
        title: "Error",
        description: "Debes seleccionar un subtema",
        variant: "destructive",
      });
      return;
    }

    if (questionBlocks.length === 0) {
      toast({
        title: "Error",
        description: "Debes agregar contenido a la pregunta",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving(true);

      let finalStimulusId = (stimulusId && stimulusId !== "new") ? stimulusId : null;

      // Create or update stimulus if needed
      if (useStimulus && stimulusBlocks.length > 0) {
        const stimulusData = {
          content_json: { blocks: stimulusBlocks } as any,
          visibility: visibility as any,
          status: "active",
          title: stimulusTitle || null,
          source: stimulusSource || null,
          origin: stimulusOrigin || null,
          code: stimulusCode || null,
        };

        if (isEditMode && stimulusId && stimulusId !== "new") {
          // Update existing stimulus
          const { error: stimulusError } = await supabase
            .from("stimuli")
            .update(stimulusData)
            .eq("id", stimulusId);

          if (stimulusError) throw stimulusError;
          finalStimulusId = stimulusId;
        } else if (!stimulusId || stimulusId === "new") {
          // Create new stimulus
          const { data: newStimulus, error: stimulusError } = await supabase
            .from("stimuli")
            .insert(stimulusData)
            .select()
            .single();

          if (stimulusError) throw stimulusError;
          finalStimulusId = newStimulus.id;
        }
      }

      // Prepare item data
      const itemData = {
        subtema_id: subtemaId,
        stimulus_id: finalStimulusId,
        difficulty: difficulty as any,
        visibility: visibility as any,
        explanation_visibility: explanationVisibility as any,
        correct_answer: correctAnswer,
        paper_type: paperType === "none" ? null : (paperType as any),
        is_similar_only: isSimilarOnly,
        question_json: { blocks: questionBlocks } as any,
        explanation_json: (explanationBlocks.length > 0 || alternativeConceptionBlocks.length > 0 ? {
          blocks: [
            ...explanationBlocks,
            ...alternativeConceptionBlocks.map(block => ({ ...block, type: "alternative_conception" }))
          ]
        } : null) as any,
      };

      let currentItemId = itemId;

      if (isEditMode && itemId) {
        // Update existing item
        const { error: itemError } = await supabase
          .from("items")
          .update(itemData)
          .eq("id", itemId);

        if (itemError) throw itemError;

        // Delete existing alternatives
        const { error: deleteError } = await supabase
          .from("alternatives")
          .delete()
          .eq("item_id", itemId);

        if (deleteError) throw deleteError;
      } else {
        // Create new item
        const { data: newItem, error: itemError } = await supabase
          .from("items")
          .insert(itemData)
          .select()
          .single();

        if (itemError) throw itemError;
        currentItemId = newItem.id;
      }

      // Insert alternatives
      const alternativeLetters = ["a", "b", "c", "d"];
      for (let i = 0; i < alternativeLetters.length; i++) {
        const letter = alternativeLetters[i];
        const blocks = alternatives[letter];

        if (blocks.length > 0) {
          const { error: altError } = await supabase
            .from("alternatives")
            .insert({
              item_id: currentItemId,
              letter,
              order_index: i,
              content_json: { blocks },
            });

          if (altError) throw altError;
        }
      }

      // Manage similar items relationships (only if editing and not a similar-only item)
      if (isEditMode && currentItemId && !isSimilarOnly) {
        // Delete existing similar items relationships
        const { error: deleteSimError } = await supabase
          .from("similar_items")
          .delete()
          .eq("original_item_id", currentItemId);

        if (deleteSimError) throw deleteSimError;

        // Insert new similar items relationships
        if (linkedSimilarItems.length > 0) {
          const similarItemsToInsert = linkedSimilarItems.map((item, index) => ({
            original_item_id: currentItemId,
            similar_item_id: item.similar_item_id || item.id,
            difficulty_order: index + 1
          }));

          const { error: insertSimError } = await supabase
            .from("similar_items")
            .insert(similarItemsToInsert);

          if (insertSimError) throw insertSimError;
        }
      }

      toast({
        title: isEditMode ? "Item actualizado" : "Item creado",
        description: isEditMode ? "El item se actualizó correctamente" : "El item se creó correctamente",
      });

      navigate("/admin/items");
    } catch (error: any) {
      toast({
        title: isEditMode ? "Error al actualizar item" : "Error al crear item",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddSimilarItem = () => {
    if (!selectedSimilarItemId) return;
    
    const itemToAdd = availableSimilarItems.find(item => item.id === selectedSimilarItemId);
    if (!itemToAdd) return;

    // Check if already added
    if (linkedSimilarItems.some(item => 
      (item.similar_item_id || item.id) === selectedSimilarItemId
    )) {
      toast({
        title: "Item ya agregado",
        description: "Este item similar ya está en la lista",
        variant: "destructive",
      });
      return;
    }

    setLinkedSimilarItems([...linkedSimilarItems, { 
      similar_item_id: itemToAdd.id,
      similar_item: itemToAdd 
    }]);
    setSelectedSimilarItemId("");
  };

  const handleRemoveSimilarItem = (similarItemId: string) => {
    setLinkedSimilarItems(linkedSimilarItems.filter(
      item => (item.similar_item_id || item.id) !== similarItemId
    ));
  };

  const moveSimilarItemUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...linkedSimilarItems];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    setLinkedSimilarItems(newItems);
  };

  const moveSimilarItemDown = (index: number) => {
    if (index === linkedSimilarItems.length - 1) return;
    const newItems = [...linkedSimilarItems];
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    setLinkedSimilarItems(newItems);
  };

  if (checkingAuth || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
          <p className="text-muted-foreground">{loading ? "Cargando..." : "Verificando permisos..."}</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  // Get slugs from selected IDs
  const selectedAudience = audiences.find(a => a.id === audienceId);
  const selectedArea = areas.find(a => a.id === areaId);
  const audienceSlug = selectedAudience?.slug;
  const areaSlug = selectedArea?.slug;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/admin/items")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
            <h1 className="text-3xl font-bold">{isEditMode ? "Editar Item" : "Crear Nuevo Item"}</h1>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Guardando..." : isEditMode ? "Actualizar Item" : "Guardar Item"}
          </Button>
        </div>

        <div className="space-y-6">
          {/* Configuración */}
          <Card>
            <CardHeader>
              <CardTitle>Configuración General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label>Audiencia *</Label>
                  <Select 
                    value={audienceId} 
                    onValueChange={(value) => {
                      setAudienceId(value);
                      setAreaId("");
                      setTemaId("");
                      setSubtemaId("");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una audiencia" />
                    </SelectTrigger>
                    <SelectContent>
                      {audiences.map((audience) => (
                        <SelectItem key={audience.id} value={audience.id}>
                          {audience.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {audienceId && (
                  <div className="space-y-2 col-span-2">
                    <Label>Área *</Label>
                    <Select 
                      value={areaId} 
                      onValueChange={(value) => {
                        setAreaId(value);
                        setTemaId("");
                        setSubtemaId("");
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un área" />
                      </SelectTrigger>
                      <SelectContent>
                        {areas
                          .filter((area) => area.audience_id === audienceId)
                          .map((area) => (
                            <SelectItem key={area.id} value={area.id}>
                              {area.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {areaId && (
                  <div className="space-y-2 col-span-2">
                    <Label>Tema *</Label>
                    <Select 
                      value={temaId} 
                      onValueChange={(value) => {
                        setTemaId(value);
                        setSubtemaId("");
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un tema" />
                      </SelectTrigger>
                      <SelectContent>
                        {temas
                          .filter((tema) => tema.area_id === areaId)
                          .map((tema) => (
                            <SelectItem key={tema.id} value={tema.id}>
                              {tema.nombre_corto} - {tema.nombre}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {temaId && (
                  <div className="space-y-2 col-span-2">
                    <Label>Subtema *</Label>
                    <Select value={subtemaId} onValueChange={setSubtemaId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un subtema" />
                      </SelectTrigger>
                      <SelectContent>
                        {subtemas
                          .filter((subtema) => subtema.tema_id === temaId)
                          .map((subtema) => (
                            <SelectItem key={subtema.id} value={subtema.id}>
                              {subtema.nombre_corto || subtema.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="space-y-2">
                  <Label>Dificultad</Label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="facil">Fácil</SelectItem>
                      <SelectItem value="medio">Medio</SelectItem>
                      <SelectItem value="dificil">Difícil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Respuesta Correcta</Label>
                  <Select value={correctAnswer} onValueChange={setCorrectAnswer}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a">A</SelectItem>
                      <SelectItem value="b">B</SelectItem>
                      <SelectItem value="c">C</SelectItem>
                      <SelectItem value="d">D</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Visibilidad Item</Label>
                  <Select value={visibility} onValueChange={setVisibility}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Gratis</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Visibilidad Explicación</Label>
                  <Select value={explanationVisibility} onValueChange={setExplanationVisibility}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Gratis</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tipo de Prueba (IB DP)</Label>
                  <Select value={paperType} onValueChange={setPaperType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No aplica</SelectItem>
                      <SelectItem value="paper1">Paper 1 (MCQ)</SelectItem>
                      <SelectItem value="paper2">Paper 2 (Extended Response)</SelectItem>
                      <SelectItem value="paper3">Paper 3 (Data Analysis)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3 col-span-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Solo para Reforzamiento</Label>
                      <CardDescription className="text-xs">
                        Este ítem solo aparecerá como problema similar, no en la lista normal de práctica
                      </CardDescription>
                    </div>
                    <Switch
                      checked={isSimilarOnly}
                      onCheckedChange={setIsSimilarOnly}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estímulo */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Estímulo</CardTitle>
                  <CardDescription>Texto introductorio o contexto (opcional)</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Label>Usar estímulo</Label>
                  <Switch checked={useStimulus} onCheckedChange={setUseStimulus} />
                </div>
              </div>
            </CardHeader>
            {useStimulus && (
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Estímulo Existente (opcional)</Label>
                  <Select value={stimulusId} onValueChange={setStimulusId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un estímulo existente o crea uno nuevo abajo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">Crear nuevo estímulo</SelectItem>
                      {stimuli.map((stimulus) => (
                        <SelectItem key={stimulus.id} value={stimulus.id}>
                          {stimulus.code ? `${stimulus.code}` : (stimulus.source || stimulus.title || `ID: ${stimulus.id.slice(0, 8)}...`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {stimulusId && (
                  <>
                    <Separator />
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Código del Estímulo (opcional)</Label>
                        <Input
                          value={stimulusCode}
                          onChange={(e) => setStimulusCode(e.target.value)}
                          placeholder="Ej: cyt-minedu-t000084"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Título (opcional)</Label>
                          <Input
                            value={stimulusTitle}
                            onChange={(e) => setStimulusTitle(e.target.value)}
                            placeholder="Título del estímulo"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Fuente (opcional)</Label>
                          <Input
                            value={stimulusSource}
                            onChange={(e) => setStimulusSource(e.target.value)}
                            placeholder="Fuente o autor"
                          />
                        </div>
                        <div className="space-y-2 col-span-2">
                          <Label>Origen (opcional)</Label>
                          <Input
                            value={stimulusOrigin}
                            onChange={(e) => setStimulusOrigin(e.target.value)}
                            placeholder="Origen del contenido"
                          />
                        </div>
                      </div>
                      <BlockEditor
                        blocks={stimulusBlocks}
                        onChange={setStimulusBlocks}
                        label={stimulusId === "new" ? "Contenido del Nuevo Estímulo" : "Contenido del Estímulo"}
                        audienceSlug={audienceSlug}
                        areaSlug={areaSlug}
                        visibility={visibility}
                      />
                    </div>
                  </>
                )}
              </CardContent>
            )}
          </Card>

          {/* Pregunta */}
          <Card>
            <CardHeader>
              <CardTitle>Pregunta *</CardTitle>
              <CardDescription>Contenido de la pregunta</CardDescription>
            </CardHeader>
            <CardContent>
              <BlockEditor
                blocks={questionBlocks}
                onChange={setQuestionBlocks}
                audienceSlug={audienceSlug}
                areaSlug={areaSlug}
                visibility={visibility}
              />
            </CardContent>
          </Card>

          {/* Alternativas */}
          <Card>
            <CardHeader>
              <CardTitle>Alternativas</CardTitle>
              <CardDescription>Define las opciones de respuesta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {["a", "b", "c", "d"].map((letter) => (
                <div key={letter} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-lg font-semibold">
                      Alternativa {letter.toUpperCase()}
                    </Label>
                    {letter === correctAnswer && (
                      <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                        (Respuesta Correcta)
                      </span>
                    )}
                  </div>
                  <BlockEditor
                    blocks={alternatives[letter]}
                    onChange={(blocks) => setAlternatives({ ...alternatives, [letter]: blocks })}
                    audienceSlug={audienceSlug}
                    areaSlug={areaSlug}
                    visibility={visibility}
                  />
                  {letter !== "d" && <Separator className="mt-4" />}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Explicación */}
          <Card>
            <CardHeader>
              <CardTitle>Explicación (opcional)</CardTitle>
              <CardDescription>Se muestra después de responder</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <BlockEditor
                blocks={explanationBlocks}
                onChange={setExplanationBlocks}
                label="Explicación"
                audienceSlug={audienceSlug}
                areaSlug={areaSlug}
                visibility={visibility}
              />
              <Separator />
              <BlockEditor
                blocks={alternativeConceptionBlocks}
                onChange={setAlternativeConceptionBlocks}
                label="Concepción Alternativa"
                description="Errores comunes o conceptos que se deben corregir"
                audienceSlug={audienceSlug}
                areaSlug={areaSlug}
                visibility={visibility}
              />
            </CardContent>
          </Card>

          {/* Similar Items - Only show if not a similar-only item and in edit mode */}
          {isEditMode && !isSimilarOnly && (
            <Card>
              <CardHeader>
                <CardTitle>Problemas Similares</CardTitle>
                <CardDescription>
                  Asocia ítems de reforzamiento que aparecerán cuando el estudiante responda incorrectamente
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add similar item */}
                <div className="flex gap-2">
                  <Select value={selectedSimilarItemId} onValueChange={setSelectedSimilarItemId}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Selecciona un item similar..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSimilarItems.map((item) => {
                        const firstBlock = item.question_json?.blocks?.[0];
                        const preview = firstBlock?.content?.substring(0, 60) || "Sin contenido";
                        return (
                          <SelectItem key={item.id} value={item.id}>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {item.difficulty}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {item.subtemas?.nombre_corto}
                              </span>
                              <span className="truncate">{preview}...</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    onClick={handleAddSimilarItem}
                    disabled={!selectedSimilarItemId}
                  >
                    Agregar
                  </Button>
                </div>

                {/* List of linked similar items */}
                {linkedSimilarItems.length > 0 ? (
                  <div className="space-y-2">
                    <Label>Items Similares Asociados ({linkedSimilarItems.length})</Label>
                    <div className="space-y-2">
                      {linkedSimilarItems.map((item, index) => {
                        const similarItem = item.similar_item || item;
                        const firstBlock = similarItem.question_json?.blocks?.[0];
                        const preview = firstBlock?.content?.substring(0, 80) || "Sin contenido";
                        
                        return (
                          <Card key={item.id || item.similar_item_id} className="p-3">
                            <div className="flex items-start gap-3">
                              <div className="flex flex-col gap-1">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => moveSimilarItemUp(index)}
                                  disabled={index === 0}
                                >
                                  ↑
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => moveSimilarItemDown(index)}
                                  disabled={index === linkedSimilarItems.length - 1}
                                >
                                  ↓
                                </Button>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant="outline" className="text-xs">
                                    #{index + 1}
                                  </Badge>
                                  <Badge variant="secondary" className="text-xs">
                                    {similarItem.difficulty}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {similarItem.subtemas?.nombre_corto}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground truncate">
                                  {preview}
                                </p>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveSimilarItem(item.similar_item_id || item.id)}
                              >
                                <span className="sr-only">Eliminar</span>
                                ✕
                              </Button>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No hay items similares asociados. Los items similares aparecerán cuando el estudiante responda incorrectamente.
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCreateItem;
