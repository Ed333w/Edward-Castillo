// ---------------------------------------------------------------
// PARTE B 
// ---------------------------------------------------------------
#include <iostream>
#include <fstream>
#include <sstream>
#include <vector>
#include <string>
#include <iomanip>

struct Registro {
    int codigo;              // clave de busqueda y ordenamiento
    std::string barrio;
    int kilos;
    int ruta;
};

// Lee registros.csv. La lectura NO forma parte de ningun algoritmo medido.
std::vector<Registro> cargar_registros(const std::string& nombre_archivo) {
    std::vector<Registro> registros;
    std::ifstream archivo(nombre_archivo);
    std::string linea;
    std::getline(archivo, linea);                   // se descarta el encabezado
    while (std::getline(archivo, linea)) {
        std::stringstream ss(linea);
        std::string codigo, barrio, kilos, ruta;
        std::getline(ss, codigo, ',');
        std::getline(ss, barrio, ',');
        std::getline(ss, kilos, ',');
        std::getline(ss, ruta, ',');
        Registro r;
        r.codigo = std::stoi(codigo);
        r.barrio = barrio;
        r.kilos  = std::stoi(kilos);
        r.ruta   = std::stoi(ruta);
        registros.push_back(r);
    }
    return registros;
}

void merge_sort(std::vector<Registro>& arr) {
    if (arr.size() > 1) {
        size_t mid = arr.size() / 2;
        std::vector<Registro> left_half(arr.begin(), arr.begin() + mid);
        std::vector<Registro> right_half(arr.begin() + mid, arr.end());

        merge_sort(left_half);
        merge_sort(right_half);

        size_t i = 0, j = 0, k = 0;
        while (i < left_half.size() && j < right_half.size()) {
            if (left_half[i].codigo < right_half[j].codigo) {
                arr[k] = left_half[i]; i++;
            } else {
                arr[k] = right_half[j]; j++;
            }
            k++;
        }
        while (i < left_half.size()) { arr[k] = left_half[i]; i++; k++; }
        while (j < right_half.size()) { arr[k] = right_half[j]; j++; k++; }
    }
}

int secuencial(const std::vector<Registro>& registros, int codigo_buscado, int& comparaciones) {
    comparaciones = 0;
    for (size_t i = 0; i < registros.size(); i++) {
        comparaciones++;
        if (registros[i].codigo == codigo_buscado) {
            return (int)i;
        }
    }
    return -1;
}

int binaria(const std::vector<Registro>& registros, int codigo_buscado, int& comparaciones) {
    int izq = 0, der = (int)registros.size() - 1;
    comparaciones = 0;
    while (izq <= der) {
        int medio = (izq + der) / 2;
        comparaciones++;
        if (registros[medio].codigo == codigo_buscado) {
            return medio;
        } else if (registros[medio].codigo < codigo_buscado) {
            izq = medio + 1;                        // descarta la mitad izquierda
        } else {
            der = medio - 1;                        // descarta la mitad derecha
        }
    }
    return -1;
}

int main() {
    std::vector<Registro> registros = cargar_registros("registros.csv");
    int n = (int)registros.size();

    // Las dos busquedas trabajan sobre el mismo vector ordenado.
    merge_sort(registros);

    std::string nombres[4] = {"Primer elemento", "Elemento del medio",
                              "Ultimo elemento", "Elemento inexistente"};
    int codigos[4] = {registros[0].codigo, registros[n / 2].codigo,
                      registros[n - 1].codigo, 999999};

    std::cout << "Coleccion: " << n << " registros ordenados por 'codigo'\n\n";
    std::cout << std::left << std::setw(22) << "Caso" << std::right
              << std::setw(8)  << "Codigo"
              << std::setw(10) << "Sec: pos"  << std::setw(11) << "Sec: comp"
              << std::setw(10) << "Bin: pos"  << std::setw(11) << "Bin: comp" << "\n";
    std::cout << std::string(72, '-') << "\n";

    for (int c = 0; c < 4; c++) {
        int comp_sec = 0, comp_bin = 0;
        int pos_sec = secuencial(registros, codigos[c], comp_sec);
        int pos_bin = binaria(registros, codigos[c], comp_bin);
        std::cout << std::left << std::setw(22) << nombres[c] << std::right
                  << std::setw(8)  << codigos[c]
                  << std::setw(10) << pos_sec << std::setw(11) << comp_sec
                  << std::setw(10) << pos_bin << std::setw(11) << comp_bin << "\n";
    }
    return 0;
}