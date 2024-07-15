function handleSelection() {
  var selectBox = document.getElementById("options");
  var selectedValue = selectBox.value;
  var actionMessage = "";

  switch (selectedValue) {
    case "servicio":
      actionMessage = "Usando el servicio de";
      break;
    case "producto":
      actionMessage = "Consumiendo el producto";
      break;
    case "curso":
    case "taller":
    case "asesoria":
    case "platica":
      actionMessage = "Participando en " + selectedValue + ".";
      break;
    case "inauguracion":
    case "evento":
    case "concurso":
      actionMessage = "Asistiendo al " + selectedValue + ".";
      break;
    default:
      actionMessage = "Selecciona una opción.";
  }

  document.getElementById("action").innerText = actionMessage;
}

// Añadir el event listener al select box
document.getElementById("options").addEventListener("change", handleSelection);

/**
 * Función asíncrona para obtener una estrategia de marketing personalizada.
 * Esta función toma el tipo de producto y una frase personalizada del usuario,
 * y utiliza una API para generar una estrategia de marketing detallada.
 */
function adjustTextareaHeight(textarea) {
  textarea.style.height = "auto"; // Resetea la altura
  textarea.style.height = textarea.scrollHeight + "px"; // Ajusta la altura al contenido
}

// Modifica la función getMarketingStrategy para ajustar la altura del textarea después de recibir la respuesta
async function getMarketingStrategy() {
  // Obtener el tipo de producto y la frase personalizada desde el DOM
  const productType = document.getElementById("productType").value;
  const customPhrase = document.getElementById("customPhrase").value;
  const companyName = document.getElementById("companyName").value;
  const selectedOption = document.getElementById("options").value;

  // API de proyecto marketing (solo se cuenta con algunos usos limitados)
  const apiKey = "sk-proj-iRAwiNSiw84uUpdjpyXGT3BlbkFJqi8U5vj5FsbSWsI0JjkB"; // Asegúrate de que esta clave sea válida y segura

  // Texto del prompt para la API
  const promptText = `Genera una estrategia de marketing para un producto de tipo ${productType} 
  de la empresa ${companyName} incluyendo:

1. **Nombre del Producto**: Proporciona un nombre creativo y atractivo para el producto.
2. **Días Recomendados**: Indica los días de la semana más efectivos para promocionar ${productType} y el ¿por qué? de esa sugerencia.
3. **Horarios Recomendados**: Especifica los horarios óptimos para publicar en redes sociales contenido del tipo ${productType} y el ¿por qué? de esa sugerencia.
4. **Ideas de Publicación**: Sugiere ideas de contenido para cada día recomendado, incluyendo imágenes, videos y textos.
5. **Thumbnail**: Describe una idea clara y llamativa para la imagen de portada en Instagram.
6. **Storytelling**: Crea una historia para Instagram presentando a un personaje ${selectedOption} ${productType} de ${companyName}, mostrando su conflicto inicial,
 sus intentos de resolverlo, el clímax emocionante y la resolución final. 
 Acompaña cada parte con imágenes o videos relevantes y un texto breve. 
 Para la imagen de portada, usa una imagen vibrante del clímax con un título llamativo.
7. **Copy**: Proporciona textos atractivos y persuasivos para acompañar cada publicación propuesta para Instagram.
8. **Idea de Reel**: Sugiere una idea de reel en tendencia, incluyendo hashtags relevantes y una fuente para consultarlo.
 Utiliza la IA para buscar tendencias actuales.
9. **Puntuación de Estrategia**: Evalúa la estrategia propuesta con una puntuación del 1 al 10.
10. **Ideas para Historias**: Proporciona ideas para historias en los días de no publicación para mantener el contacto con la comunidad, 
incluyendo ligas de internet de donde se pueda sacar el contenido.
11. **Planificación Semanal**: Detalla una planificación semanal para elaborar el contenido con una semana de anticipación.
12. **Festividades o Fechas Relacionadas**: Identifica festividades o fechas relevantes relacionadas con el producto, mostrando la fecha,
resumen del evento y país donde se celebra.
13. **URLs de Contenido Sugerido**: Incluye enlaces a fuentes de contenido relevantes para las historias y publicaciones
El lenguaje debe ser amigable y objetivo. Incluye la frase: "${customPhrase}" si se proporciona. Sé creativo con las respuestas.
`;

  // Mostrar el promptText en la consola
  console.log(promptText);

  try {
    // Realizar la solicitud a la API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant and You are a marketing expert.",
          },
          { role: "user", content: promptText },
        ],
        max_tokens: 1300,
        temperature: 0.8,
        top_p: 0.9,
      }),
    });
    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      throw new Error("Error en la solicitud");
    }
    // Procesar la respuesta de la API
    const data = await response.json();
    const result = data.choices[0].message.content;
    // Mostrar el resultado en el elemento con id "result1"
    const resultTextarea = document.getElementById("result1");
    resultTextarea.value = result.trim();
    adjustTextareaHeight(resultTextarea); // Ajustar la altura del textarea
  } catch (error) {
    // Manejo de errores
    console.error(`Hubo un error: ${error.message}`);
    const resultTextarea = document.getElementById("result1");
    resultTextarea.value =
      "Hubo un error al obtener la estrategia. Por favor, inténtelo de nuevo.";
    adjustTextareaHeight(resultTextarea); // Ajustar la altura del textarea
  }
}

function copyToClipboard() {
  const resultTextarea = document.getElementById("result1");
  resultTextarea.select();
  resultTextarea.setSelectionRange(0, 99999); // Para dispositivos móviles

  try {
    document.execCommand("copy");
    alert("Texto copiado al portapapeles");
  } catch (err) {
    console.error("Error al copiar el texto: ", err);
    alert("Hubo un error al copiar el texto. Por favor, inténtelo de nuevo.");
  }
}
