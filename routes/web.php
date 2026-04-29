<?php

use App\Http\Controllers\ChatbotDemoController;
use App\Http\Controllers\Admin\ChatbotAdminController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', [ChatbotDemoController::class, 'landing'])->name('home');

Route::get('/demo-chatbot', [ChatbotDemoController::class, 'landing'])->name('chatbot.demo');
Route::get('/demo-chatbot/chat', [ChatbotDemoController::class, 'chat'])->name('chatbot.demo.chat');
Route::post('/demo-chatbot/reply', [ChatbotDemoController::class, 'reply'])->name('chatbot.demo.reply');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [ChatbotAdminController::class, 'dashboard'])->name('dashboard');
    Route::post('/admin/products', [ChatbotAdminController::class, 'storeProduct'])->name('admin.products.store');
    Route::put('/admin/products/{product}', [ChatbotAdminController::class, 'updateProduct'])->name('admin.products.update');
    Route::delete('/admin/products/{product}', [ChatbotAdminController::class, 'deleteProduct'])->name('admin.products.delete');
    Route::post('/admin/flows', [ChatbotAdminController::class, 'storeFlow'])->name('admin.flows.store');
    Route::put('/admin/flows/{flow}', [ChatbotAdminController::class, 'updateFlow'])->name('admin.flows.update');
    Route::delete('/admin/flows/{flow}', [ChatbotAdminController::class, 'deleteFlow'])->name('admin.flows.delete');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
