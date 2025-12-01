<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Inquiry;

class PlantInquirySeeder extends Seeder
{
    public function run(): void
    {
        $inquiry = Inquiry::firstOrNew(['title' => '¿Por qué las plantas son verdes?']);

        $inquiry->fill([
            'title' => '¿Por qué las plantas son verdes?',
            'description' => 'Descubre el fascinante mundo de la fotosíntesis y aprende por qué la mayoría de las plantas tienen ese hermoso color verde.',
            'content' => [
                'difficulty' => 'guided',
                'estimated_time' => 20,
                'topic' => 'biology',
                'learning_objectives' => [
                    'Comprender el proceso de fotosíntesis',
                    'Identificar el rol de la clorofila',
                    'Relacionar la absorción de luz con el color',
                ],
                'steps' => [
                    [
                        'number' => 1,
                        'title' => 'Observa y Pregunta',
                        'type' => 'problem',
                        'content' => [
                            'introduction' => 'Mira a tu alrededor. ¿Qué colores ves en las plantas? La mayoría son verdes, pero ¿por qué?',
                            'prompt' => 'Escribe tu pregunta de investigación sobre el color de las plantas',
                            'hints' => [
                                'Una buena pregunta incluye "por qué" o "cómo"',
                                'Piensa en qué hace que las plantas sean verdes',
                            ],
                        ],
                        'xp_reward' => 10,
                    ],
                    [
                        'number' => 2,
                        'title' => 'Formula tu Hipótesis',
                        'type' => 'hypothesis',
                        'content' => [
                            'introduction' => 'Ahora que tienes una pregunta, ¿qué crees que es la respuesta?',
                            'template' => 'Si [causa] entonces [efecto]',
                            'variables' => [
                                'independent' => ['luz solar', 'clorofila', 'agua'],
                                'dependent' => ['color verde', 'fotosíntesis'],
                            ],
                        ],
                        'xp_reward' => 20,
                    ],
                    [
                        'number' => 3,
                        'title' => 'Experimenta con Luz',
                        'type' => 'experiment',
                        'content' => [
                            'introduction' => 'Usa el simulador para ver cómo diferentes colores de luz afectan a la planta',
                            'simulator_type' => 'plant_photosynthesis',
                        ],
                        'xp_reward' => 15,
                    ],
                    [
                        'number' => 4,
                        'title' => 'Registra tus Datos',
                        'type' => 'data_record',
                        'content' => [
                            'introduction' => 'Organiza los datos que obtuviste en el experimento',
                        ],
                        'xp_reward' => 20,
                    ],
                    [
                        'number' => 5,
                        'title' => 'Analiza y Concluye',
                        'type' => 'analysis',
                        'content' => [
                            'introduction' => 'Ahora analiza tus resultados y compáralos con tu hipótesis',
                            'questions' => [
                                [
                                    'id' => 'q1',
                                    'text' => '¿Qué color de luz fue más absorbido por la planta?',
                                    'type' => 'multiple_choice',
                                    'options' => ['Rojo', 'Verde', 'Azul', 'Rojo y Azul'],
                                    'correct' => 'Rojo y Azul',
                                    'feedback' => [
                                        'correct' => '¡Excelente! La clorofila absorbe principalmente luz roja y azul para realizar la fotosíntesis.',
                                        'incorrect' => 'Revisa tus datos experimentales. Observa qué colores mostraron mayor absorción y fotosíntesis.',
                                    ],
                                    'hints' => [
                                        'Mira la tabla de datos que registraste',
                                        'Compara los porcentajes de absorción',
                                        'Los colores con mayor absorción tienen mayor fotosíntesis',
                                    ],
                                ],
                                [
                                    'id' => 'q2',
                                    'text' => '¿Por qué vemos las plantas verdes?',
                                    'type' => 'open',
                                    'keywords' => ['refleja', 'verde', 'absorbe', 'rojo', 'azul'],
                                    'sample_answer' => 'Las plantas son verdes porque la clorofila absorbe la luz roja y azul, pero refleja la luz verde, que es la que llega a nuestros ojos.',
                                    'feedback' => [
                                        'good' => '¡Muy bien! Has comprendido que vemos el color que se refleja, no el que se absorbe.',
                                        'partial' => 'Vas por buen camino. Recuerda que vemos el color que NO es absorbido.',
                                        'needs_improvement' => 'Piensa: ¿qué pasa con la luz que NO es absorbida por la planta?',
                                    ],
                                ],
                                [
                                    'id' => 'q3',
                                    'text' => '¿Qué pasaría si una planta solo recibiera luz verde?',
                                    'type' => 'open',
                                    'keywords' => ['poco', 'lento', 'moriría', 'no crece', 'fotosíntesis baja'],
                                    'sample_answer' => 'La planta crecería muy lento o moriría porque la luz verde es reflejada, no absorbida, entonces habría muy poca fotosíntesis.',
                                    'hints' => [
                                        'Recuerda qué pasó en tu experimento con luz verde',
                                        'La luz verde tiene baja absorción',
                                        'Sin absorción de luz, no hay energía para fotosíntesis',
                                    ],
                                ],
                                [
                                    'id' => 'q4',
                                    'text' => '¿Por qué la clorofila es importante para las plantas?',
                                    'type' => 'open',
                                    'keywords' => ['captura', 'energía', 'luz', 'fotosíntesis', 'alimento'],
                                    'sample_answer' => 'La clorofila captura la energía de la luz solar y la usa para realizar la fotosíntesis, produciendo el alimento que la planta necesita.',
                                ],
                                [
                                    'id' => 'q5',
                                    'text' => '¿Tu hipótesis inicial fue correcta? Explica.',
                                    'type' => 'open',
                                    'keywords' => ['sí', 'no', 'parcialmente', 'porque', 'datos'],
                                    'sample_answer' => 'Mi hipótesis fue correcta porque predije que la clorofila hace que las plantas sean verdes, y los datos mostraron que la luz verde es reflejada.',
                                ],
                            ],
                        ],
                        'xp_reward' => 40,
                    ],
                ],
            ],
        ]);

        $inquiry->save();

        $this->command->info('✅ Indagación creada exitosamente!');
    }
}
