// Declaraciones y datos de la red. NO MODIFIQUE ESTE ARCHIVO.
#pragma once
#include <vector>
#include <string>
#include <algorithm>

inline const std::vector<std::string> NOMBRES = {
    "ACOPIO","NORTE","SUR","ORIENTE","OCCIDENTE",
    "PLANTA","TALLER","PUERTO","VEREDA","MINA"};
inline const std::vector<std::pair<int,int>> ARISTAS = {
    {0,1},{0,2},{0,3},{1,4},{1,5},{2,7},{3,6},{5,6},{4,7},{7,8},{6,9}};
inline const int N = 10;

inline std::vector<std::vector<int>> construir(const std::vector<std::pair<int,int>>& ar) {
    std::vector<std::vector<int>> g(N);
    for (auto [u, v] : ar) { g[u].push_back(v); g[v].push_back(u); }
    for (auto& x : g) std::sort(x.begin(), x.end());
    return g;
}

int cuantasComponentes(const std::vector<std::vector<int>>& g);
std::vector<std::string> viasCriticas();
